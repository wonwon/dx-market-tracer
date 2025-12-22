import os
import json
import re
import requests
from bs4 import BeautifulSoup
import yfinance as yf
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/test")
def test():
    return "Flask is working!"

FAVORITES_FILE = "favorites.json"

# ---------------------------------------------------------
# 1. データの永続化と取得
# ---------------------------------------------------------
def load_favorites():
    if os.path.exists(FAVORITES_FILE):
        try:
            with open(FAVORITES_FILE, "r") as f:
                data = json.load(f)
                if isinstance(data, list):
                    # 旧形式を新形式に変換
                    return {c: "" for c in data}
                return data
        except:
            return {"6752": "パナソニック", "9434": "ソフトバンク"}
    return {"6752": "パナソニック", "9434": "ソフトバンク"}

def save_favorites(favs):
    with open(FAVORITES_FILE, "w") as f:
        json.dump(favs, f, ensure_ascii=False)

def get_stock_details(stock_code):
    if not stock_code or not re.match(r'^\d{4}$', stock_code):
        return {}
    url = f"https://kabutan.jp/stock/?code={stock_code}"
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        response = requests.get(url, headers=headers, timeout=5)
        soup = BeautifulSoup(response.text, 'html.parser')
        
        details = {"code": stock_code}
        
        # 1. 銘柄名と市場
        company_block = soup.find('div', class_='company_block')
        if company_block:
            h3 = company_block.find('h3')
            if h3:
                name = h3.get_text(strip=True)
                details["name"] = re.sub(r'^\d{4}\s*', '', name)
            market = company_block.find('span', class_='market')
            details["market"] = market.get_text(strip=True) if market else "---"

        # 2. 株価・前日比
        kabuka_table = soup.find('table', class_='kabuka')
        if kabuka_table:
            tds = kabuka_table.find_all('td')
            if len(tds) >= 4:
                details["price"] = tds[0].get_text(strip=True)
                details["change"] = tds[1].get_text(strip=True)
                details["change_pct"] = tds[2].get_text(strip=True)
                details["time"] = tds[3].get_text(strip=True)

        # 3. 投資指標 (VWAP, 出来高, 利回り)
        # stockinfo_i1, i2, i3 あたりから取得
        for info_id in ['stockinfo_i1', 'stockinfo_i2', 'stockinfo_i3']:
            info_div = soup.find('div', id=info_id)
            if info_div:
                dls = info_div.find_all('dl')
                for dl in dls:
                    dt = dl.find('dt').get_text(strip=True)
                    dd = dl.find('dd').get_text(strip=True)
                    if "VWAP" in dt: details["vwap"] = dd
                    if "出来高" in dt: details["volume"] = dd
                    if "利回り" in dt: details["yield"] = dd
                    if "決算発表日" in dt or "決算日" in dt: details["earnings_date"] = dd

        # 4. 信用残・乖離率 (さらに下のテーブル)
        # 信用残テーブルを探す
        margin_table = soup.find('table', class_='margin_table')
        if margin_table:
            rows = margin_table.find_all('tr')
            for row in rows:
                if "売残" in row.get_text():
                    details["margin_sell"] = row.find_all('td')[1].get_text(strip=True)
                if "買残" in row.get_text():
                    details["margin_buy"] = row.find_all('td')[1].get_text(strip=True)
                if "倍率" in row.get_text():
                    details["margin_ratio"] = row.find_all('td')[1].get_text(strip=True)

        # 5. 移動平均乖離率
        kairi_table = soup.find('table', class_='kairi_table')
        if kairi_table:
            rows = kairi_table.find_all('tr')
            for row in rows:
                if "25日" in row.get_text():
                    details["kairi_25"] = row.find_all('td')[1].get_text(strip=True)
                if "75日" in row.get_text():
                    details["kairi_75"] = row.find_all('td')[1].get_text(strip=True)

        # 欠損値の埋め合わせ
        placeholders = {
            "name": "---", "market": "---", "price": "---", "change": "---", 
            "change_pct": "---", "time": "---", "vwap": "---", "volume": "---",
            "yield": "---", "earnings_date": "---", "margin_buy": "---", 
            "margin_sell": "---", "margin_ratio": "---", "kairi_25": "---", "kairi_75": "---"
        }
        for k, v in placeholders.items():
            if k not in details: details[k] = v

        return details
    except:
        return {}

def get_kabutan_news(stock_code):
    url = f"https://kabutan.jp/stock/news?code={stock_code}"
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        response = requests.get(url, headers=headers, timeout=5)
        soup = BeautifulSoup(response.text, 'html.parser')
        news_items = []
        table = soup.find('table', class_='s_news_list')
        if table:
            rows = table.find_all('tr')
            for row in rows:
                time_td = row.find('td', class_='date')
                time_str = time_td.get_text(strip=True) if time_td else ""
                link_tag = row.find('a')
                if link_tag:
                    title = link_tag.get_text(strip=True)
                    href = link_tag.get('href')
                    if not href.startswith('http'):
                        href = f"https://kabutan.jp{href}"
                    news_items.append({"title": f"[{time_str}] {title}", "url": href})
                if len(news_items) >= 15: break
        return news_items
    except:
        return []

# ---------------------------------------------------------
# 2. ルート定義
# ---------------------------------------------------------
@app.route("/")
def index():
    favs = load_favorites()
    current_code = request.args.get("code")
    if not current_code:
        current_code = list(favs.keys())[0] if favs else "7203"
    
    details = get_stock_details(current_code)
    news = get_kabutan_news(current_code)
    
    return render_template("index.html", 
                           favorites=favs, 
                           current_code=current_code, 
                           stock=details,
                           news=news)

@app.route("/stock/<codeSegment>")
def stock_panel(codeSegment):
    """HTMX用：銘柄詳細パネルのみを返す"""
    details = get_stock_details(codeSegment)
    news = get_kabutan_news(codeSegment)
    return render_template("partials/stock_panel.html", 
                           current_code=codeSegment, 
                           stock=details, 
                           news=news)

@app.route("/api/stock_data/<code>")
def get_historical_data(code):
    """チャート描画用の数値を返す"""
    try:
        # 日本株の場合は .T を付与（とりあえず東証前提）
        ticker_code = f"{code}.T"
        ticker = yf.Ticker(ticker_code)
        # 直近6ヶ月分のデータを取得
        df = ticker.history(period="6mo")
        
        if df.empty:
            return jsonify({"error": "No data found"}), 404
            
        data = []
        for index, row in df.iterrows():
            data.append({
                "time": index.strftime('%Y-%m-%d'),
                "open": float(row['Open']),
                "high": float(row['High']),
                "low": float(row['Low']),
                "close": float(row['Close'])
            })
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/favorites/add", methods=["POST"])
def add_favorite():
    code = request.form.get("code")
    if code and re.match(r'^\d{4}$', code):
        favs = load_favorites()
        if code not in favs:
            name = get_stock_name(code)
            favs[code] = name
            save_favorites(favs)
    return render_template("partials/watchlist.html", favorites=load_favorites())

@app.route("/favorites/remove", methods=["POST"])
def remove_favorite():
    code = request.form.get("code")
    favs = load_favorites()
    if code in favs:
        del favs[code]
        save_favorites(favs)
    return render_template("partials/watchlist.html", favorites=load_favorites())

@app.route("/favorites/import", methods=["POST"])
def import_favorites():
    text = request.form.get("text")
    codes = re.findall(r'\b(\d{4})\b', text)
    favs = load_favorites()
    for c in codes:
        if c not in favs:
            favs[c] = get_stock_name(c)
    save_favorites(favs)
    return render_template("partials/watchlist.html", favorites=load_favorites())

if __name__ == "__main__":
    # GCP (Cloud Run) のポート番号に対応
    port = int(os.environ.get("PORT", 5001))
    app.run(debug=True, host="0.0.0.0", port=port)

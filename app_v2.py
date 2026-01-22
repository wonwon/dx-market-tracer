import os
import json
import re
import requests
from bs4 import BeautifulSoup
from flask import Flask, render_template, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

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
                    return {c: "" for c in data}
                return data
        except:
            return {"6752": "パナソニック", "9434": "ソフトバンク"}
    return {"6752": "パナソニック", "9434": "ソフトバンク"}

def save_favorites(favs):
    with open(FAVORITES_FILE, "w") as f:
        json.dump(favs, f, ensure_ascii=False)

def get_stock_name(stock_code):
    if not stock_code or not re.match(r'^\d{4}$', stock_code):
        return ""
    url = f"https://kabutan.jp/stock/?code={stock_code}"
    headers = {"User-Agent": "Mozilla/5.0"}
    try:
        response = requests.get(url, headers=headers, timeout=5)
        soup = BeautifulSoup(response.text, 'html.parser')
        title = soup.find('div', class_='company_block')
        if title:
            h3 = title.find('h3')
            if h3:
                name = h3.get_text(strip=True)
                name = re.sub(r'^\d{4}\s*', '', name)
                return name
        return ""
    except:
        return ""

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
    
    stock_name = favs.get(current_code, "")
    if not stock_name:
        stock_name = get_stock_name(current_code)
    
    news = get_kabutan_news(current_code)
    
    return render_template("index.html", 
                           favorites=favs, 
                           current_code=current_code, 
                           stock_name=stock_name,
                           news=news)

@app.route("/stock/<codeSegment>")
def stock_panel(codeSegment):
    """HTMX用：銘柄詳細パネルのみを返す"""
    favs = load_favorites()
    name = favs.get(codeSegment, "")
    if not name:
        name = get_stock_name(codeSegment)
    news = get_kabutan_news(codeSegment)
    return render_template("partials/stock_panel.html", 
                           current_code=codeSegment, 
                           stock_name=name, 
                           news=news)

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
    app.run(debug=True, port=5001)

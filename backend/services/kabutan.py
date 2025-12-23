import httpx
from bs4 import BeautifulSoup
import re
from typing import List, Optional
from schemas.stock import StockDetails, NewsItem, OHLCV

class KabutanService:
    BASE_URL = "https://kabutan.jp"
    HEADERS = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36"
    }

    async def get_stock_details(self, code: str) -> StockDetails:
        url = f"{self.BASE_URL}/stock/?code={code}"
        async with httpx.AsyncClient(headers=self.HEADERS, timeout=10.0) as client:
            response = await client.get(url)
            if response.status_code != 200:
                return StockDetails(code=code, name="Error")
            
            soup = BeautifulSoup(response.text, 'html.parser')
            
            # 基本情報
            name = ""
            company_block = soup.find('div', class_='company_block')
            if company_block and company_block.find('h3'):
                name = re.sub(r'^\d{4}\s*', '', company_block.find('h3').get_text(strip=True))

            # 株価情報 (Selectors refined)
            current_price = ""
            change = ""
            change_percent = ""
            
            kabuka_span = soup.select_one(".kabuka")
            if kabuka_span:
                current_price = kabuka_span.get_text(strip=True)
            
            # 前日比の抽出
            si_dl1 = soup.select_one(".si_i1_dl1")
            if si_dl1:
                dds = si_dl1.find_all('dd')
                if len(dds) >= 2:
                    change = dds[0].get_text(strip=True)
                    change_percent = dds[1].get_text(strip=True).replace("%", "")

            # 詳細指標を抽出する関数
            def get_val(label):
                headers = soup.find_all(['th', 'td'])
                for cell in headers:
                    cell_text = cell.get_text(strip=True)
                    if label == cell_text or (label in cell_text and len(cell_text) < 20):
                        # Case 1: Horizontal header in a <thead> or <tr> with <td> below
                        table = cell.find_parent('table')
                        if table:
                            row = cell.find_parent('tr')
                            if row:
                                siblings = row.find_all(['th', 'td'])
                                idx = siblings.index(cell)
                                # Check if it's a vertical or horizontal table
                                # If it's a header row and there's a tbody with data
                                tbody = table.find('tbody')
                                if tbody and tbody != row.parent:
                                    trs = tbody.find_all('tr')
                                    if trs:
                                        target_tds = trs[0].find_all('td')
                                        if len(target_tds) > idx:
                                            return target_tds[idx].get_text(strip=True)
                        
                        # Case 2: Vertical header (th -> td)
                        td = cell.find_next_sibling('td')
                        if td:
                            return td.get_text(strip=True)
                return "-"

            # 指標情報
            vwap = get_val("VWAP")
            volume = get_val("出来高")
            
            # ... (margin logic remains same)
            # 信用取引情報の抽出 (Table based)
            margin_buy = "-"
            margin_sell = "-"
            margin_ratio = "-"
            
            shinyo_h2 = soup.find('h2', string=re.compile("信用取引"))
            if shinyo_h2:
                shinyo_table = shinyo_h2.find_next('table')
                if shinyo_table:
                    tbody = shinyo_table.find('tbody')
                    if tbody:
                        first_row = tbody.find('tr')
                        if first_row:
                            td_cells = first_row.find_all('td')
                            if len(td_cells) >= 3:
                                margin_sell = td_cells[0].get_text(strip=True)
                                margin_buy = td_cells[1].get_text(strip=True)
                                margin_ratio = td_cells[2].get_text(strip=True)

            # 乖離率の抽出
            ma25_diff = "-"
            ma75_diff = "-"
            trend_div = soup.select_one(".kabuka_trend")
            if trend_div:
                rows = trend_div.find_all('tr')
                if len(rows) >= 2:
                    # ヘッダー行に「25日」「75日」が含まれているか確認
                    header_tds = rows[0].find_all(['th', 'td'])
                    val_tds = rows[1].find_all(['th', 'td'])
                    for i, h in enumerate(header_tds):
                        if "25日" in h.get_text():
                            if len(val_tds) > i:
                                ma25_diff = val_tds[i].get_text(strip=True)
                        if "75日" in h.get_text():
                            if len(val_tds) > i:
                                ma75_diff = val_tds[i].get_text(strip=True)

            yield_val = get_val("利回り")
            settlement = get_val("決算発表日")

            # 同時並行でニュースと履歴を取得
            news = await self.get_news(code)
            history = await self.get_history(code)

            details = StockDetails(
                code=code,
                name=name,
                current_price=current_price,
                change=change,
                change_percent=change_percent,
                vwap=vwap,
                volume=volume,
                margin_buy=margin_buy,
                margin_sell=margin_sell,
                margin_ratio=margin_ratio,
                ma25_diff=ma25_diff,
                ma75_diff=ma75_diff,
                dividend_yield=yield_val,
                settlement_date=settlement,
                news=news,
                history=history
            )
            return details

    async def get_news(self, code: str) -> List[NewsItem]:
        url = f"{self.BASE_URL}/stock/news?code={code}"
        async with httpx.AsyncClient(headers=self.HEADERS, timeout=10.0) as client:
            response = await client.get(url)
            if response.status_code != 200:
                return []
            
            soup = BeautifulSoup(response.text, 'html.parser')
            news_items = []
            table = soup.find('table', class_='s_news_list')
            if table:
                for row in table.find_all('tr')[:15]:
                    link = row.find('a')
                    if link:
                        title = link.get_text(strip=True)
                        href = link.get('href')
                        if not href.startswith('http'):
                            href = f"{self.BASE_URL}{href}"
                        news_items.append(NewsItem(title=title, url=href))
            return news_items

    async def get_history(self, code: str) -> List[OHLCV]:
        url = f"{self.BASE_URL}/stock/kabuka?code={code}"
        async with httpx.AsyncClient(headers=self.HEADERS, timeout=10.0) as client:
            response = await client.get(url)
            if response.status_code != 200:
                return []
            
            soup = BeautifulSoup(response.text, 'html.parser')
            history = []

            def clean_num(s):
                if not s: return 0
                return re.sub(r'[^\d.]', '', s)

            # 履歴テーブル (日付, 始値, 高値, 安値, 終値, 前日比, 騰落率, 売買高)
            tables = soup.select("table.stock_kabuka0, table.stock_kabuka_dwm")
            for table in tables:
                tbody = table.find('tbody')
                if not tbody: continue
                rows = tbody.find_all('tr')
                for row in rows:
                    tds = row.find_all(['th', 'td'])
                    if len(tds) >= 8:
                        # 日付はthのtimeタグ
                        date_tag = tds[0].find('time')
                        date_str = date_tag.get('datetime') if date_tag else tds[0].get_text(strip=True)
                        
                        try:
                            o = float(clean_num(tds[1].get_text(strip=True)))
                            h = float(clean_num(tds[2].get_text(strip=True)))
                            l = float(clean_num(tds[3].get_text(strip=True)))
                            c = float(clean_num(tds[4].get_text(strip=True)))
                            v = int(clean_num(tds[7].get_text(strip=True)))
                            
                            # VWAPの推定 (Typical Price: (H+L+C)/3)
                            est_vwap = round((h + l + c) / 3, 2)
                            
                            item = OHLCV(
                                date=date_str,
                                open=o,
                                high=h,
                                low=l,
                                close=c,
                                volume=v,
                                vwap=est_vwap
                            )
                            history.append(item)
                        except (ValueError, TypeError):
                            continue
            
            # 日付順にソート（古い順）
            history.sort(key=lambda x: x.date)
            return history

import httpx
import asyncio
from bs4 import BeautifulSoup
import re
from typing import List, Optional
from schemas.stock import StockDetails, NewsItem, OHLCV, MarketIndices, IndexInfo

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

            # 詳細指標を抽出する関数 (より堅牢に)
            def get_val(label):
                # ユーザーフィードバックに基づき、表形式や隣接要素から柔軟に値を抽出
                cells = soup.find_all(['th', 'td'], string=re.compile(f"^{label}$|{label}"))
                for cell in cells:
                    # 1. 次の兄弟要素がtdならその値
                    sibling = cell.find_next_sibling(['td', 'th'])
                    if sibling:
                        val = sibling.get_text(strip=True)
                        if val and val != label: return val
                    
                    # 2. 親要素の次の行の同じインデックスを探索
                    row = cell.find_parent('tr')
                    if row:
                        parent = row.parent
                        rows = parent.find_all('tr')
                        try:
                            row_idx = rows.index(row)
                            if row_idx + 1 < len(rows):
                                siblings = row.find_all(['th', 'td'])
                                cell_idx = siblings.index(cell)
                                next_row_cells = rows[row_idx + 1].find_all(['th', 'td'])
                                if len(next_row_cells) > cell_idx:
                                    val = next_row_cells[cell_idx].get_text(strip=True)
                                    if val: return val
                        except (ValueError, IndexError): pass
                return "-"

            # 指標抽出のための汎用ヘルパー
            def find_metric(label, fuzzy=False):
                pattern = re.compile(f"^{label}$" if not fuzzy else label)
                # 1. th/tdの中から検索
                cell = soup.find(['th', 'td', 'dt'], string=pattern)
                if not cell:
                    # テキストとして含む要素を検索
                    cell = soup.find(lambda t: t.name in ['th', 'td', 'dt', 'span'] and label in t.get_text())
                
                if cell:
                    # 次の兄弟要素をチェック
                    sibling = cell.find_next_sibling(['td', 'dd', 'span'])
                    if sibling:
                        text = sibling.get_text(strip=True)
                        if text and text != label: return text
                    
                    # 親の次の要素をチェック (Vertical layout)
                    parent = cell.parent
                    if parent:
                        next_p = parent.find_next_sibling()
                        if next_p:
                            val = next_p.get_text(strip=True)
                            if val: return val
                return "-"

            # 指標情報
            vwap = find_metric("VWAP")
            volume = find_metric("出来高")
            
            # 1. 主要指標テーブル (PER, PBR, 利回り, 信用倍率) の精密抽出
            yield_val = "-"
            margin_ratio = "-"
            stats_div = soup.find('div', id='stockinfo_i3')
            if stats_div:
                thead = stats_div.find('thead')
                tbody = stats_div.find('tbody')
                if thead and tbody:
                    ths = thead.find_all('th')
                    tds = tbody.find_all('td')
                    for i, th in enumerate(ths):
                        if i < len(tds):
                            th_text = th.get_text(strip=True)
                            val = tds[i].get_text(strip=True)
                            if "利回り" in th_text: yield_val = val
                            if "信用倍率" in th_text: margin_ratio = val

            # 2. VWAP と 出来高
            vwap = find_metric("VWAP")
            volume = find_metric("出来高")

            # 3. 信用残高 (専用テーブル)
            margin_buy = "-"
            margin_sell = "-"
            shinyo_h2 = soup.find('h2', string=re.compile("信用取引"))
            if shinyo_h2:
                shinyo_table = shinyo_h2.find_next('table')
                if shinyo_table:
                    td_list = shinyo_table.find_all('td')
                    if len(td_list) >= 2:
                        margin_sell = td_list[0].get_text(strip=True)
                        margin_buy = td_list[1].get_text(strip=True)
                        # ここでもしmargin_ratioが取れていなければ上書き
                        if margin_ratio == "-" and len(td_list) >= 3:
                            margin_ratio = td_list[2].get_text(strip=True)

            # 4. 25日/75日乖離率
            ma25_diff = "-"
            ma75_diff = "-"
            trend_table = soup.select_one(".kabuka_trend")
            if trend_table:
                trs = trend_table.find_all('tr')
                if len(trs) >= 2:
                    td_list = trs[1].find_all('td')
                    if len(td_list) >= 2:
                        ma25_diff = td_list[0].get_text(strip=True)
                        ma75_diff = td_list[1].get_text(strip=True)

            # 5. 決算・配当・優待の日程 (より柔軟な検索)
            def get_robust_date(labels):
                for label in labels:
                    target = soup.find(['th', 'td', 'dt'], string=re.compile(label))
                    if target:
                        sib = target.find_next_sibling(['td', 'dd'])
                        if sib: return sib.get_text(strip=True)
                        # Vertical case
                        tr = target.find_parent('tr')
                        if tr:
                            next_tr = tr.find_next_sibling('tr')
                            if next_tr:
                                idx = tr.find_all(['th', 'td']).index(target)
                                next_tds = next_tr.find_all(['th', 'td'])
                                if len(next_tds) > idx: return next_tds[idx].get_text(strip=True)
                return "-"

            settlement = get_robust_date(["決算発表日", "発表日"])
            ex_div = get_robust_date(["配当落ち日", "配当落", "権利付最終"])
            benefit = get_robust_date(["優待発生月", "優待権利", "株主優待"])

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
                ex_dividend_date=ex_div,
                benefit_date=benefit,
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

    async def get_market_indices(self) -> MarketIndices:
        indices = await asyncio.gather(
            self._get_index_info("0000", "日経平均"),
            self._get_index_info("0010", "TOPIX"),
            self._get_index_info("0411", "日経先物")
        )
        return MarketIndices(
            nikkei225=indices[0],
            topix=indices[1],
            futures=indices[2]
        )

    async def _get_index_info(self, code: str, fallback_name: str) -> IndexInfo:
        url = f"{self.BASE_URL}/stock/chart?code={code}"
        async with httpx.AsyncClient(headers=self.HEADERS, timeout=10.0) as client:
            try:
                response = await client.get(url)
                if response.status_code != 200:
                    return IndexInfo(name=fallback_name, price="---", change="---", change_percent="---")
                
                soup = BeautifulSoup(response.text, 'html.parser')
                
                # インデックス名
                name = fallback_name
                company_block = soup.find('div', class_='company_block')
                if company_block and company_block.find('h3'):
                    name = re.sub(r'^\d{4}\s*', '', company_block.find('h3').get_text(strip=True))

                # 株価情報
                price = "---"
                change = "---"
                pct = "---"
                
                kabuka_span = soup.select_one(".kabuka")
                if kabuka_span:
                    price = kabuka_span.get_text(strip=True)
                
                si_dl1 = soup.select_one(".si_i1_dl1")
                if si_dl1:
                    dds = si_dl1.find_all('dd')
                    if len(dds) >= 2:
                        change = dds[0].get_text(strip=True)
                        pct = dds[1].get_text(strip=True)
                
                return IndexInfo(name=name, price=price, change=change, change_percent=pct)
            except Exception:
                return IndexInfo(name=fallback_name, price="---", change="---", change_percent="---")

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

from pydantic import BaseModel, Field
from typing import List, Optional

class NewsItem(BaseModel):
    title: str
    url: str

class OHLCV(BaseModel):
    date: str
    open: float
    high: float
    low: float
    close: float
    volume: int
    vwap: Optional[float] = None

class IndexInfo(BaseModel):
    name: str
    price: str
    change: str
    change_percent: str

class MarketIndices(BaseModel):
    nikkei225: IndexInfo
    topix: IndexInfo
    futures: IndexInfo

class StockDetails(BaseModel):
    code: str
    name: str
    current_price: Optional[str] = None
    change: Optional[str] = None
    change_percent: Optional[str] = None
    vwap: Optional[str] = None
    volume: Optional[str] = None
    margin_buy: Optional[str] = None
    margin_sell: Optional[str] = None
    margin_ratio: Optional[str] = None
    ma25_diff: Optional[str] = None
    ma75_diff: Optional[str] = None
    dividend_yield: Optional[str] = None
    ex_dividend_date: Optional[str] = None
    benefit_date: Optional[str] = None
    settlement_date: Optional[str] = None
    news: List[NewsItem] = []
    history: List[OHLCV] = []

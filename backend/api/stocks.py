from fastapi import APIRouter, HTTPException
from services.kabutan import KabutanService
from schemas.stock import StockDetails, MarketIndices, WatchlistCategory
import json
import os

WATCHLIST_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "watchlist.json")

router = APIRouter(prefix="/stocks", tags=["stocks"])
service = KabutanService()

@router.get("/market", response_model=MarketIndices)
async def get_market():
    try:
        return await service.get_market_indices()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{code}", response_model=StockDetails)
async def get_stock(code: str):
    try:
        details = await service.get_stock_details(code)
        if details.name == "Error":
            raise HTTPException(status_code=404, detail="Stock not found")
        return details
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/watchlist", response_model=List[WatchlistCategory])
async def get_watchlist():
    try:
        if not os.path.exists(WATCHLIST_FILE):
            return []
        with open(WATCHLIST_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/watchlist")
async def save_watchlist(categories: List[WatchlistCategory]):
    try:
        with open(WATCHLIST_FILE, "w", encoding="utf-8") as f:
            json.dump([cat.dict() for cat in categories], f, ensure_ascii=False, indent=2)
        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

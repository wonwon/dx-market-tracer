from fastapi import APIRouter, HTTPException
from services.kabutan import KabutanService
from schemas.stock import StockDetails, MarketIndices, WatchlistCategory
import json
import os
from typing import List
from database import get_watchlist, save_watchlist

WATCHLIST_FILE = os.path.join(os.path.dirname(os.path.dirname(__file__)), "watchlist.json")

router = APIRouter(prefix="/stocks", tags=["stocks"])
service = KabutanService()

@router.get("/market", response_model=MarketIndices)
async def get_market():
    try:
        return await service.get_market_indices()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/watchlist", response_model=List[WatchlistCategory])
async def get_watchlist_route():
    try:
        return get_watchlist()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/watchlist")
async def save_watchlist_route(categories: List[WatchlistCategory]):
    try:
        save_watchlist([cat.model_dump() for cat in categories])
        return {"status": "success"}
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

from fastapi import APIRouter, HTTPException
from services.kabutan import KabutanService
from schemas.stock import StockDetails

router = APIRouter(prefix="/stocks", tags=["stocks"])
service = KabutanService()

@router.get("/{code}", response_model=StockDetails)
async def get_stock(code: str):
    try:
        details = await service.get_stock_details(code)
        if details.name == "Error":
            raise HTTPException(status_code=404, detail="Stock not found")
        return details
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

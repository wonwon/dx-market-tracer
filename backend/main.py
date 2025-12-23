from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.stocks import router as stocks_router

app = FastAPI(title="TradeInfo API", version="3.0.0")

# CORS設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 開発用。本番では適切に制限すること
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(stocks_router)

@app.get("/")
async def root():
    return {"message": "TradeInfo API v3 is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

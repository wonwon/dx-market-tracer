from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
import os

router = APIRouter(prefix="/review", tags=["review"])

DATA_FILE = "review_status.json"

class ReviewItem(BaseModel):
    id: str
    category: str
    title: str
    description: str
    is_checked: bool = False
    comment: Optional[str] = ""

class ReviewStatus(BaseModel):
    items: List[ReviewItem]
    overall_status: str = "pending"  # pending, fixed, approved

def load_status() -> ReviewStatus:
    if not os.path.exists(DATA_FILE):
        return ReviewStatus(items=[])
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            data = json.load(f)
            return ReviewStatus(**data)
    except Exception:
        return ReviewStatus(items=[])

def save_status(status: ReviewStatus):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(status.model_dump(), f, ensure_ascii=False, indent=2)

@router.get("", response_model=ReviewStatus)
async def get_review_status():
    return load_status()

@router.post("/items", response_model=ReviewStatus)
async def update_items(items: List[ReviewItem]):
    status = load_status()
    status.items = items
    save_status(status)
    return status

@router.post("/item/{item_id}", response_model=ReviewStatus)
async def update_item(item_id: str, updated_item: ReviewItem):
    status = load_status()
    for i, item in enumerate(status.items):
        if item.id == item_id:
            status.items[i] = updated_item
            break
    else:
        status.items.append(updated_item)
    save_status(status)
    return status

@router.post("/approve", response_model=ReviewStatus)
async def approve_all():
    status = load_status()
    status.overall_status = "approved"
    save_status(status)
    # Here we could trigger a git push or other actions in the future
    return status

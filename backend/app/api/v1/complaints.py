from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.schemas.communication import ComplaintCreate, ComplaintResponse
from app.repositories.communication import complaint_repo
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[ComplaintResponse])
async def get_complaints(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    return await complaint_repo.get_multi(db)

@router.post("/", response_model=ComplaintResponse)
async def create_complaint(
    complaint_in: ComplaintCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    return await complaint_repo.create(db, obj_in=complaint_in)

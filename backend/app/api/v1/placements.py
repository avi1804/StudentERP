from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.schemas.placement import PlacementDriveCreate, PlacementDriveResponse, PlacementCompanyResponse, PlacementCompanyCreate
from app.repositories.placement import placement_company_repo, placement_drive_repo
from app.models.user import User

router = APIRouter()

@router.get("/companies", response_model=List[PlacementCompanyResponse])
async def get_companies(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    return await placement_company_repo.get_multi(db)

@router.post("/companies", response_model=PlacementCompanyResponse)
async def create_company(
    company_in: PlacementCompanyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    return await placement_company_repo.create(db, obj_in=company_in)

@router.get("/drives", response_model=List[PlacementDriveResponse])
async def get_drives(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    return await placement_drive_repo.get_multi(db)

@router.post("/drives", response_model=PlacementDriveResponse)
async def create_drive(
    drive_in: PlacementDriveCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    return await placement_drive_repo.create(db, obj_in=drive_in)

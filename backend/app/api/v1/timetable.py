from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List

from app.schemas.timetable import TimetableCreate, TimetableResponse, TimetableUpdate
from app.repositories.timetable import timetable_repo
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.models.user import User, Role
from app.core.exceptions import BadRequestException, NotFoundException

router = APIRouter()

@router.post("/", response_model=TimetableResponse, status_code=status.HTTP_201_CREATED)
async def create_timetable_entry(
    entry_in: TimetableCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    """
    Create a new timetable entry (Admin only).
    """
    return await timetable_repo.create(db, obj_in=entry_in)

@router.get("/department/{department_id}", response_model=List[TimetableResponse])
async def read_department_timetable(
    department_id: int,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get timetable for a department.
    """
    return await timetable_repo.get_multi_by_department(db, department_id=department_id, skip=skip, limit=limit)

@router.delete("/{id}", response_model=TimetableResponse)
async def delete_timetable_entry(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    """
    Delete a timetable entry (Admin only).
    """
    entry = await timetable_repo.get(db, id=id)
    if not entry:
        raise NotFoundException("Timetable entry not found")
        
    return await timetable_repo.remove(db, id=id)

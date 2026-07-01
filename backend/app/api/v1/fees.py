from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List

from app.schemas.fees import FeesCreate, FeesResponse, FeesUpdate
from app.repositories.fees import fees_repo
from app.repositories.student import student_repo
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.models.user import User, Role
from app.core.exceptions import BadRequestException, NotFoundException, ForbiddenException

router = APIRouter()

@router.post("/", response_model=FeesResponse, status_code=status.HTTP_201_CREATED)
async def create_fee_record(
    fee_in: FeesCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole([Role.ADMIN]))
) -> Any:
    """
    Add fee record (Admin only).
    """
    return await fees_repo.create(db, obj_in=fee_in)

@router.put("/{id}", response_model=FeesResponse)
async def update_fee_record(
    id: int,
    fee_in: FeesUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole([Role.ADMIN]))
) -> Any:
    """
    Update fee record (Admin only).
    """
    fee_record = await fees_repo.get(db, id=id)
    if not fee_record:
        raise NotFoundException("Fee record not found")
        
    return await fees_repo.update(db, db_obj=fee_record, obj_in=fee_in)

@router.get("/student/{student_id}", response_model=List[FeesResponse])
async def read_student_fees(
    student_id: int,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get fee records for a specific student.
    Students can only view their own fees.
    """
    student = await student_repo.get(db, id=student_id)
    if not student:
        raise NotFoundException("Student not found")

    if current_user.role == Role.STUDENT and student.user_id != current_user.id:
        raise ForbiddenException("You can only view your own fees.")

    return await fees_repo.get_multi_by_student(db, student_id=student_id, skip=skip, limit=limit)

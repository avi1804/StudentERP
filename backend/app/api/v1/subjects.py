from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List

from app.schemas.academic import SubjectCreate, SubjectResponse, SubjectUpdate
from app.repositories.subject import subject_repo
from app.repositories.academic import department_repo
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.models.user import User, Role
from app.core.exceptions import BadRequestException, NotFoundException

router = APIRouter()

@router.post("/", response_model=SubjectResponse, status_code=status.HTTP_201_CREATED)
async def create_subject(
    subject_in: SubjectCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    """
    Create new subject (Admin only).
    """
    if await subject_repo.get_by_code(db, code=subject_in.code):
        raise BadRequestException("Subject with this code already exists.")
        
    if not await department_repo.get(db, id=subject_in.department_id):
        raise BadRequestException("Department does not exist.")

    return await subject_repo.create(db, obj_in=subject_in)


from app.schemas.pagination import Pagination

@router.get("/", response_model=Pagination[SubjectResponse])
async def read_subjects(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Retrieve all subjects.
    """
    subjects = await subject_repo.get_multi(db, skip=skip, limit=limit)
    total = len(subjects) if subjects else 0
    pages = (total + limit - 1) // limit if limit > 0 else 1
    page = (skip // limit) + 1 if limit > 0 else 1
    return Pagination(items=subjects, total=total, page=page, size=limit, pages=pages)


@router.get("/{id}", response_model=SubjectResponse)
async def read_subject(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get subject by ID.
    """
    subject = await subject_repo.get(db, id=id)
    if not subject:
        raise NotFoundException("Subject not found")
    return subject


@router.put("/{id}", response_model=SubjectResponse)
async def update_subject(
    id: int,
    subject_in: SubjectUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    """
    Update subject (Admin only).
    """
    subject = await subject_repo.get(db, id=id)
    if not subject:
        raise NotFoundException("Subject not found")
        
    if subject_in.department_id and not await department_repo.get(db, id=subject_in.department_id):
        raise BadRequestException("Department does not exist.")
        
    return await subject_repo.update(db, db_obj=subject, obj_in=subject_in)

@router.delete("/{id}", response_model=SubjectResponse)
async def delete_subject(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    """
    Delete subject (Admin only).
    """
    subject = await subject_repo.get(db, id=id)
    if not subject:
        raise NotFoundException("Subject not found")
        
    return await subject_repo.remove(db, id=id)

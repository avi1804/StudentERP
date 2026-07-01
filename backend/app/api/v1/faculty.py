from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List

from app.schemas.faculty import FacultyCreate, FacultyResponse, FacultyUpdate
from app.repositories.faculty import faculty_repo
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.models.user import User, Role
from app.core.exceptions import BadRequestException, NotFoundException, ForbiddenException

router = APIRouter()

@router.post("/", response_model=FacultyResponse, status_code=status.HTTP_201_CREATED)
async def create_faculty(
    faculty_in: FacultyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole([Role.ADMIN]))
) -> Any:
    """
    Create new faculty profile (Admin only).
    """
    if await faculty_repo.get_by_employee_id(db, employee_id=faculty_in.employee_id):
        raise BadRequestException("Faculty with this employee ID already exists.")
    
    if await faculty_repo.get_by_user_id(db, user_id=faculty_in.user_id):
        raise BadRequestException("User already has a faculty profile.")

    return await faculty_repo.create(db, obj_in=faculty_in)


@router.get("/", response_model=List[FacultyResponse])
async def read_faculties(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole([Role.ADMIN, Role.FACULTY, Role.STUDENT]))
) -> Any:
    """
    Retrieve all faculty members.
    """
    return await faculty_repo.get_multi(db, skip=skip, limit=limit)


@router.get("/me", response_model=FacultyResponse)
async def read_faculty_me(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole([Role.FACULTY]))
) -> Any:
    """
    Get current faculty profile.
    """
    faculty = await faculty_repo.get_by_user_id(db, user_id=current_user.id)
    if not faculty:
        raise NotFoundException("Faculty profile not found")
    return faculty


@router.get("/{id}", response_model=FacultyResponse)
async def read_faculty(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get faculty by ID.
    """
    faculty = await faculty_repo.get(db, id=id)
    if not faculty:
        raise NotFoundException("Faculty not found")
    return faculty


@router.put("/{id}", response_model=FacultyResponse)
async def update_faculty(
    id: int,
    faculty_in: FacultyUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole([Role.ADMIN]))
) -> Any:
    """
    Update faculty profile (Admin only).
    """
    faculty = await faculty_repo.get(db, id=id)
    if not faculty:
        raise NotFoundException("Faculty not found")
        
    return await faculty_repo.update(db, db_obj=faculty, obj_in=faculty_in)

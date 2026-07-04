from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List

from app.schemas.faculty import FacultyCreate, FacultyResponse, FacultyUpdate, FacultyEnroll
from app.repositories.faculty import faculty_repo
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.models.user import User, Role
from app.core.exceptions import BadRequestException, NotFoundException, ForbiddenException
from app.services.faculty_service import FacultyService
from app.schemas.pagination import Pagination

router = APIRouter()

@router.post("/", response_model=FacultyResponse, status_code=status.HTTP_201_CREATED)
async def create_faculty(
    faculty_in: FacultyCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    """
    Create new faculty profile (Admin only).
    """
    if await faculty_repo.get_by_employee_id(db, employee_id=faculty_in.employee_id):
        raise BadRequestException("Faculty with this employee ID already exists.")
    
    if await faculty_repo.get_by_user_id(db, user_id=faculty_in.user_id):
        raise BadRequestException("User already has a faculty profile.")

    return await faculty_repo.create(db, obj_in=faculty_in)


@router.post("/enroll", response_model=FacultyResponse, status_code=status.HTTP_201_CREATED)
async def enroll_faculty(
    faculty_data: FacultyEnroll,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    """
    Enroll a new faculty member (create User account + Faculty profile).
    """
    return await FacultyService.enroll_faculty(db, faculty_data)


@router.get("/", response_model=Pagination[FacultyResponse])
async def read_faculties(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin", "faculty", "student"]))
) -> Any:
    """
    Retrieve all faculty members.
    """
    faculties = await faculty_repo.get_multi(db, skip=skip, limit=limit)
    total = len(faculties) if faculties else 0
    pages = (total + limit - 1) // limit if limit > 0 else 1
    page = (skip // limit) + 1 if limit > 0 else 1
    
    return Pagination(
        items=faculties,
        total=total,
        page=page,
        size=limit,
        pages=pages
    )


@router.get("/me", response_model=FacultyResponse)
async def read_faculty_me(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["faculty"]))
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
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    """
    Update faculty profile (Admin only).
    """
    faculty = await faculty_repo.get(db, id=id)
    if not faculty:
        raise NotFoundException("Faculty not found")
        
    return await faculty_repo.update(db, db_obj=faculty, obj_in=faculty_in)


@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_faculty(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> None:
    """
    Delete faculty profile (Admin only).
    """
    success = await FacultyService.delete_faculty(db, id)
    if not success:
        raise NotFoundException("Faculty not found")
        
    return None

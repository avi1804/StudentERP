from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List

from app.schemas.student import StudentCreate, StudentResponse, StudentUpdate
from app.repositories.student import student_repo
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.models.user import User, Role
from app.core.exceptions import BadRequestException, NotFoundException, ForbiddenException

router = APIRouter()

@router.post("/", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
async def create_student(
    student_in: StudentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole([Role.ADMIN]))
) -> Any:
    """
    Create new student profile (Admin only).
    """
    if await student_repo.get_by_enrollment_number(db, enrollment_number=student_in.enrollment_number):
        raise BadRequestException("Student with this enrollment number already exists.")
    
    if await student_repo.get_by_user_id(db, user_id=student_in.user_id):
        raise BadRequestException("User already has a student profile.")

    return await student_repo.create(db, obj_in=student_in)


@router.get("/", response_model=List[StudentResponse])
async def read_students(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole([Role.ADMIN, Role.FACULTY]))
) -> Any:
    """
    Retrieve all students (Admin/Faculty).
    """
    return await student_repo.get_multi(db, skip=skip, limit=limit)


@router.get("/me", response_model=StudentResponse)
async def read_student_me(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole([Role.STUDENT]))
) -> Any:
    """
    Get current student profile.
    """
    student = await student_repo.get_by_user_id(db, user_id=current_user.id)
    if not student:
        raise NotFoundException("Student profile not found")
    return student


@router.get("/{id}", response_model=StudentResponse)
async def read_student(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get student by ID.
    Students can only view their own profile. Admin/Faculty can view any.
    """
    student = await student_repo.get(db, id=id)
    if not student:
        raise NotFoundException("Student not found")
        
    if current_user.role == Role.STUDENT and student.user_id != current_user.id:
        raise ForbiddenException()
        
    return student


@router.put("/{id}", response_model=StudentResponse)
async def update_student(
    id: int,
    student_in: StudentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole([Role.ADMIN]))
) -> Any:
    """
    Update student profile (Admin only).
    """
    student = await student_repo.get(db, id=id)
    if not student:
        raise NotFoundException("Student not found")
        
    return await student_repo.update(db, db_obj=student, obj_in=student_in)

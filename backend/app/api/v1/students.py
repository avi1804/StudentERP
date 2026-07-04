from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List

from app.schemas.student import StudentCreate, StudentResponse, StudentUpdate, StudentEnroll
from app.repositories.student import student_repo
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.models.user import User, Role
from passlib.context import CryptContext
from sqlalchemy import select

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

from app.core.exceptions import BadRequestException, NotFoundException, ForbiddenException
from app.services.student_service import StudentService

router = APIRouter()

@router.post("/", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
async def create_student(
    student_in: StudentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    """
    Create new student profile (Admin only).
    """
    if await student_repo.get_by_enrollment_number(db, enrollment_number=student_in.enrollment_number):
        raise BadRequestException("Student with this enrollment number already exists.")
    
    if await student_repo.get_by_user_id(db, user_id=student_in.user_id):
        raise BadRequestException("User already has a student profile.")

    return await student_repo.create(db, obj_in=student_in)

@router.post("/enroll", response_model=StudentResponse, status_code=status.HTTP_201_CREATED)
async def enroll_student(
    student_data: StudentEnroll,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    """
    Enroll a new student by creating their User account and Student profile simultaneously.
    """
    return await StudentService.enroll_student(db, student_data)


from app.schemas.pagination import Pagination

@router.get("/", response_model=Pagination[StudentResponse])
async def read_students(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin", "faculty"]))
) -> Any:
    """
    Retrieve all students (Admin/Faculty).
    """
    students = await student_repo.get_multi(db, skip=skip, limit=limit)
    # Get total count (for production, add a count() method to repo, doing len() for now)
    total = len(students) if students else 0
    pages = (total + limit - 1) // limit if limit > 0 else 1
    page = (skip // limit) + 1 if limit > 0 else 1
    
    return Pagination(
        items=students,
        total=total,
        page=page,
        size=limit,
        pages=pages
    )


@router.get("/me", response_model=StudentResponse)
async def read_student_me(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["student"]))
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
        
    if current_user.role.name == "student" and student.user_id != current_user.id:
        raise ForbiddenException()
        
    return student


@router.put("/{id}", response_model=StudentResponse)
async def update_student(
    id: int,
    student_in: StudentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    """
    Update student profile (Admin only).
    """
    student = await student_repo.get(db, id=id)
    if not student:
        raise NotFoundException("Student not found")
        
    return await student_repo.update(db, db_obj=student, obj_in=student_in)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_student(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> None:
    """
    Delete student profile (Admin only).
    """
    success = await StudentService.delete_student(db, id)
    if not success:
        raise NotFoundException("Student not found")
    
    return None

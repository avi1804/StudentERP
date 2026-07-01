from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List

from app.schemas.marks import MarksCreate, MarksResponse, MarksUpdate
from app.repositories.marks import marks_repo
from app.repositories.student import student_repo
from app.repositories.faculty import faculty_repo
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.models.user import User, Role
from app.core.exceptions import BadRequestException, NotFoundException, ForbiddenException

router = APIRouter()

@router.post("/", response_model=MarksResponse, status_code=status.HTTP_201_CREATED)
async def create_marks(
    marks_in: MarksCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole([Role.ADMIN, Role.FACULTY]))
) -> Any:
    """
    Add marks (Admin/Faculty only).
    """
    if current_user.role == Role.FACULTY:
        faculty = await faculty_repo.get_by_user_id(db, user_id=current_user.id)
        if not faculty or faculty.id != marks_in.faculty_id:
            raise ForbiddenException("You can only add marks as yourself.")

    if await marks_repo.get_by_student_and_subject(
        db, 
        student_id=marks_in.student_id, 
        subject_id=marks_in.subject_id,
        exam_type=marks_in.exam_type
    ):
        raise BadRequestException("Marks already added for this student, subject and exam type.")

    return await marks_repo.create(db, obj_in=marks_in)


@router.get("/student/{student_id}", response_model=List[MarksResponse])
async def read_student_marks(
    student_id: int,
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get marks for a specific student.
    Students can only view their own marks.
    """
    student = await student_repo.get(db, id=student_id)
    if not student:
        raise NotFoundException("Student not found")

    if current_user.role == Role.STUDENT and student.user_id != current_user.id:
        raise ForbiddenException("You can only view your own marks.")

    return await marks_repo.get_multi_by_student(db, student_id=student_id, skip=skip, limit=limit)

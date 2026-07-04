from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.schemas.marks import ExamCreate, ExamResponse, ExamResultCreate, ExamResultResponse
from app.repositories.marks import exam_repo, exam_result_repo
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=List[ExamResponse])
async def get_exams(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    return await exam_repo.get_multi(db)

@router.post("/", response_model=ExamResponse)
async def create_exam(
    exam_in: ExamCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    return await exam_repo.create(db, obj_in=exam_in)

@router.get("/results", response_model=List[ExamResultResponse])
async def get_results(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    return await exam_result_repo.get_multi(db)

@router.post("/results", response_model=ExamResultResponse)
async def create_result(
    result_in: ExamResultCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin", "faculty"]))
) -> Any:
    return await exam_result_repo.create(db, obj_in=result_in)

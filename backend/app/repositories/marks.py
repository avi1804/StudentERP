from typing import Optional, List
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.base import CRUDBase
from app.models.marks import Marks
from app.schemas.marks import MarksCreate, MarksUpdate

class MarksRepository(CRUDBase[Marks, MarksCreate, MarksUpdate]):
    async def get_by_student_and_subject(self, db: AsyncSession, *, student_id: int, subject_id: int, exam_type: str) -> Optional[Marks]:
        result = await db.execute(
            select(Marks)
            .where(Marks.student_id == student_id)
            .where(Marks.subject_id == subject_id)
            .where(Marks.exam_type == exam_type)
        )
        return result.scalars().first()
        
    async def get_multi_by_student(self, db: AsyncSession, *, student_id: int, skip: int = 0, limit: int = 100) -> List[Marks]:
        result = await db.execute(
            select(Marks)
            .where(Marks.student_id == student_id)
            .offset(skip)
            .limit(limit)
        )
        return result.scalars().all()

marks_repo = MarksRepository(Marks)

from app.models.marks import Exam, ExamResult
from app.schemas.marks import ExamCreate, ExamUpdate, ExamResultCreate, ExamResultUpdate

exam_repo = CRUDBase[Exam, ExamCreate, ExamUpdate](Exam)
exam_result_repo = CRUDBase[ExamResult, ExamResultCreate, ExamResultUpdate](ExamResult)


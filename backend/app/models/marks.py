from sqlalchemy import Integer, String, ForeignKey, Float, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column
from app.database.base import Base

class Marks(Base):
    __tablename__ = "marks"

    __table_args__ = (
        UniqueConstraint('student_id', 'subject_id', 'exam_type', name='uq_student_subject_exam'),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), index=True)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id", ondelete="CASCADE"), index=True)
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculty.id", ondelete="CASCADE"))
    exam_type: Mapped[str] = mapped_column(String(50)) # e.g., Midterm, Final, Assignment
    score: Mapped[float] = mapped_column(Float)
    total_score: Mapped[float] = mapped_column(Float)

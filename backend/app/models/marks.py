from typing import TYPE_CHECKING
from sqlalchemy import Float, ForeignKey, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base
import enum

if TYPE_CHECKING:
    from app.models.student import Student
    from app.models.subject import Subject
    from app.models.faculty import Faculty

class ExamType(str, enum.Enum):
    MID_SEM = "MID_SEM"
    END_SEM = "END_SEM"
    INTERNAL = "INTERNAL"
    PRACTICAL = "PRACTICAL"

class Marks(Base):
    __tablename__ = "marks"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    exam_type: Mapped[ExamType] = mapped_column(Enum(ExamType), nullable=False)
    marks_obtained: Mapped[float] = mapped_column(Float, nullable=False)
    total_marks: Mapped[float] = mapped_column(Float, nullable=False)
    added_by_id: Mapped[int] = mapped_column(ForeignKey("faculty.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    student: Mapped["Student"] = relationship("Student")
    subject: Mapped["Subject"] = relationship("Subject", back_populates="marks_records")
    added_by: Mapped["Faculty"] = relationship("Faculty")

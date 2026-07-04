from typing import TYPE_CHECKING, Optional
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.course import Course
    from app.models.faculty import Faculty
    from app.models.subject import Subject


class SubjectAssignment(Base):
    __tablename__ = "subject_assignments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculty.id", ondelete="CASCADE"), nullable=False)
    course_id: Mapped[Optional[int]] = mapped_column(ForeignKey("courses.id", ondelete="CASCADE"), nullable=True)
    batch: Mapped[str] = mapped_column(String(20)) # e.g. "2023-2027"
    academic_year: Mapped[str] = mapped_column(String(20)) # e.g. "2024-2025"

    # Relationships
    subject: Mapped["Subject"] = relationship("Subject", back_populates="assignments")
    faculty: Mapped["Faculty"] = relationship("Faculty", back_populates="assignments")
    course_rel: Mapped[Optional["Course"]] = relationship("Course")

from typing import TYPE_CHECKING, List
from datetime import date
from sqlalchemy import String, ForeignKey, Float, UniqueConstraint, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.student import Student
    from app.models.subject import Subject


class Exam(Base):
    __tablename__ = "exams"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), index=True) # e.g. "Mid Semester Fall 2026"
    academic_year: Mapped[str] = mapped_column(String(20))
    start_date: Mapped[date] = mapped_column(Date)
    end_date: Mapped[date] = mapped_column(Date)

    # Relationships
    results: Mapped[List["ExamResult"]] = relationship("ExamResult", back_populates="exam", cascade="all, delete-orphan")


class Marks(Base):
    """Subject-wise component marks (Assignment, Quiz, etc)"""
    __tablename__ = "marks"

    __table_args__ = (
        UniqueConstraint('student_id', 'subject_id', 'exam_type', name='uq_student_subject_exam'),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), index=True)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id", ondelete="CASCADE"), index=True)
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculty.id", ondelete="SET NULL"), nullable=True)
    exam_type: Mapped[str] = mapped_column(String(50)) # e.g., Midterm, Final, Assignment
    score: Mapped[float] = mapped_column(Float)
    total_score: Mapped[float] = mapped_column(Float)

    # Relationships
    student: Mapped["Student"] = relationship("Student")
    subject: Mapped["Subject"] = relationship("Subject", back_populates="marks")


class ExamResult(Base):
    """Aggregated final results for a student in a specific exam"""
    __tablename__ = "exam_results"

    __table_args__ = (
        UniqueConstraint('student_id', 'exam_id', name='uq_student_exam'),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    exam_id: Mapped[int] = mapped_column(ForeignKey("exams.id", ondelete="CASCADE"), index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), index=True)
    total_marks: Mapped[float] = mapped_column(Float)
    obtained_marks: Mapped[float] = mapped_column(Float)
    percentage: Mapped[float] = mapped_column(Float)
    grade: Mapped[str] = mapped_column(String(5))
    status: Mapped[str] = mapped_column(String(20)) # PASS/FAIL

    # Relationships
    exam: Mapped["Exam"] = relationship("Exam", back_populates="results")
    student: Mapped["Student"] = relationship("Student")

from datetime import datetime, date
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import String, Integer, Float, Text, Boolean, Date, DateTime, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.faculty import Faculty
    from app.models.subject import Subject
    from app.models.student import Student


class Assignment(Base):
    __tablename__ = "assignments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculty.id", ondelete="CASCADE"), index=True)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id", ondelete="CASCADE"), index=True)
    semester: Mapped[int] = mapped_column(Integer, default=7)
    section: Mapped[str] = mapped_column(String(20), default="A")
    title: Mapped[str] = mapped_column(String(255), index=True)
    description: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    instructions: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    assignment_type: Mapped[str] = mapped_column(String(50), default="Homework")
    max_marks: Mapped[float] = mapped_column(Float, default=20.0)
    attachment_url: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)
    assigned_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    due_date: Mapped[date] = mapped_column(Date)
    due_time: Mapped[str] = mapped_column(String(20), default="23:59")
    allow_late_submission: Mapped[bool] = mapped_column(Boolean, default=True)
    max_file_size_mb: Mapped[int] = mapped_column(Integer, default=10)
    allowed_file_types: Mapped[str] = mapped_column(String(100), default="pdf,docx,pptx,zip,png,jpg")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    faculty: Mapped["Faculty"] = relationship("Faculty")
    subject: Mapped["Subject"] = relationship("Subject")
    submissions: Mapped[List["AssignmentSubmission"]] = relationship("AssignmentSubmission", back_populates="assignment", cascade="all, delete-orphan")


class AssignmentSubmission(Base):
    __tablename__ = "assignment_submissions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    assignment_id: Mapped[int] = mapped_column(ForeignKey("assignments.id", ondelete="CASCADE"), index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), index=True)
    submission_url: Mapped[str] = mapped_column(String(500))
    file_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    submitted_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    submission_status: Mapped[str] = mapped_column(String(50), default="SUBMITTED") # SUBMITTED, LATE, GRADED, PENDING_REVIEW
    marks: Mapped[Optional[float]] = mapped_column(Float, nullable=True)
    remarks: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    graded_by: Mapped[Optional[int]] = mapped_column(ForeignKey("faculty.id"), nullable=True)
    graded_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    # Relationships
    assignment: Mapped["Assignment"] = relationship("Assignment", back_populates="submissions")
    student: Mapped["Student"] = relationship("Student")
    grader: Mapped[Optional["Faculty"]] = relationship("Faculty")

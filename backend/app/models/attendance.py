from datetime import date, datetime
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import ForeignKey, Date, Boolean, UniqueConstraint, String, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.student import Student


class AttendanceSession(Base):
    __tablename__ = "attendance_sessions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculty.id", ondelete="CASCADE"), index=True)
    subject_assignment_id: Mapped[int] = mapped_column(ForeignKey("subject_assignments.id", ondelete="CASCADE"), index=True)
    date: Mapped[date] = mapped_column(Date, index=True)
    start_time: Mapped[datetime] = mapped_column(DateTime)
    end_time: Mapped[datetime] = mapped_column(DateTime)
    qr_code_hash: Mapped[Optional[str]] = mapped_column(String(255), unique=True, index=True, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    # Relationships
    logs: Mapped[List["AttendanceLog"]] = relationship("AttendanceLog", back_populates="session", cascade="all, delete-orphan")


class AttendanceLog(Base):
    __tablename__ = "attendance_logs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("attendance_sessions.id", ondelete="CASCADE"), index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), index=True)
    scan_time: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    ip_address: Mapped[Optional[str]] = mapped_column(String(50))
    status: Mapped[str] = mapped_column(String(20), default="PRESENT") # PRESENT, LATE, ABSENT

    # Ensure a student can only scan once per session
    __table_args__ = (
        UniqueConstraint('session_id', 'student_id', name='uq_session_student'),
    )

    # Relationships
    session: Mapped["AttendanceSession"] = relationship("AttendanceSession", back_populates="logs")
    student: Mapped["Student"] = relationship("Student")


class Attendance(Base):
    """Aggregate table for fast queries"""
    __tablename__ = "attendance"
    
    __table_args__ = (
        UniqueConstraint('student_id', 'subject_id', 'date', name='uq_student_subject_date'),
    )

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), index=True)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id", ondelete="CASCADE"), index=True)
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculty.id", ondelete="CASCADE"))
    date: Mapped[date] = mapped_column(Date, index=True)
    is_present: Mapped[bool] = mapped_column(Boolean, default=False)

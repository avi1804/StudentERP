from datetime import datetime, date
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import String, Integer, Float, Boolean, Date, DateTime, Text, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base
import enum

if TYPE_CHECKING:
    from app.models.faculty import Faculty
    from app.models.subject import Subject
    from app.models.student import Student


class AIAttendanceSessionStatus(str, enum.Enum):
    PENDING_REVIEW = "PENDING_REVIEW"
    CONFIRMED = "CONFIRMED"
    CANCELLED = "CANCELLED"
    FAILED = "FAILED"


class AIAttendanceMatchStatus(str, enum.Enum):
    AUTO_MATCHED = "AUTO_MATCHED"
    REVIEW_REQUIRED = "REVIEW_REQUIRED"
    CONFIRMED = "CONFIRMED"
    REJECTED = "REJECTED"
    NOT_FOUND = "NOT_FOUND"


class AIAttendanceSession(Base):
    __tablename__ = "ai_attendance_sessions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculty.id", ondelete="CASCADE"), nullable=False)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    date: Mapped[date] = mapped_column(Date, nullable=False)
    
    file_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    file_type: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)  # "pdf" | "image" | "text"
    extracted_text: Mapped[Optional[str]] = mapped_column(Text, nullable=True)
    
    status: Mapped[str] = mapped_column(String(30), default=AIAttendanceSessionStatus.PENDING_REVIEW.value, nullable=False)
    
    total_detected: Mapped[int] = mapped_column(Integer, default=0)
    total_matched: Mapped[int] = mapped_column(Integer, default=0)
    total_review: Mapped[int] = mapped_column(Integer, default=0)
    total_unmatched: Mapped[int] = mapped_column(Integer, default=0)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)
    confirmed_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)

    # Relationships
    faculty: Mapped["Faculty"] = relationship("Faculty")
    subject: Mapped["Subject"] = relationship("Subject")
    matches: Mapped[List["AIAttendanceMatch"]] = relationship("AIAttendanceMatch", back_populates="session", cascade="all, delete-orphan")


class AIAttendanceMatch(Base):
    __tablename__ = "ai_attendance_matches"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("ai_attendance_sessions.id", ondelete="CASCADE"), nullable=False)
    
    enrollment_number: Mapped[str] = mapped_column(String(100), nullable=False)
    normalized_enrollment: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)
    student_id: Mapped[Optional[int]] = mapped_column(ForeignKey("students.id", ondelete="SET NULL"), nullable=True)
    
    confidence: Mapped[float] = mapped_column(Float, default=0.0, nullable=False)
    status: Mapped[str] = mapped_column(String(30), default=AIAttendanceMatchStatus.REVIEW_REQUIRED.value, nullable=False)
    
    source_text: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    match_reason: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    marked_present: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow, nullable=False)

    # Relationships
    session: Mapped["AIAttendanceSession"] = relationship("AIAttendanceSession", back_populates="matches")
    student: Mapped[Optional["Student"]] = relationship("Student")

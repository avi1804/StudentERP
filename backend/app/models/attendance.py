from typing import TYPE_CHECKING, Optional
from sqlalchemy import String, ForeignKey, Date, Enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base
import enum

if TYPE_CHECKING:
    from app.models.student import Student
    from app.models.subject import Subject
    from app.models.faculty import Faculty

class AttendanceStatus(str, enum.Enum):
    PRESENT = "PRESENT"
    ABSENT = "ABSENT"
    LATE = "LATE"

class Attendance(Base):
    __tablename__ = "attendance"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    date: Mapped[str] = mapped_column(Date, nullable=False)
    status: Mapped[AttendanceStatus] = mapped_column(Enum(AttendanceStatus), nullable=False)
    marked_by_id: Mapped[Optional[int]] = mapped_column(ForeignKey("faculty.id", ondelete="SET NULL"), nullable=True)

    # New fields for lecture-wise tracking
    lecture_id: Mapped[Optional[str]] = mapped_column(String(150), nullable=True, index=True)
    time: Mapped[Optional[str]] = mapped_column(String(10), nullable=True)  # e.g. "09:45"
    attendance_method: Mapped[str] = mapped_column(String(20), default="Manual")  # "Manual" | "QR"

    # Relationships
    student: Mapped["Student"] = relationship("Student")
    subject: Mapped["Subject"] = relationship("Subject", back_populates="attendance_records")
    marked_by: Mapped[Optional["Faculty"]] = relationship("Faculty")

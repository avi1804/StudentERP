from typing import TYPE_CHECKING
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
    date: Mapped[str] = mapped_column(Date, nullable=False) # Date or string for SQLite compatibility? Let's use Date since student.py uses Date. Actually, let's use standard Date from sqlalchemy
    status: Mapped[AttendanceStatus] = mapped_column(Enum(AttendanceStatus), nullable=False)
    marked_by_id: Mapped[int] = mapped_column(ForeignKey("faculty.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    student: Mapped["Student"] = relationship("Student")
    subject: Mapped["Subject"] = relationship("Subject", back_populates="attendance_records")
    marked_by: Mapped["Faculty"] = relationship("Faculty")

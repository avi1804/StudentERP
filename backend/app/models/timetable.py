from typing import TYPE_CHECKING, Optional
from sqlalchemy import String, ForeignKey, Time
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.course import Course
    from app.models.department import Department
    from app.models.faculty import Faculty
    from app.models.subject import Subject


class Timetable(Base):
    __tablename__ = "timetable"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id", ondelete="CASCADE"), index=True)
    subject_id: Mapped[int] = mapped_column(ForeignKey("subjects.id", ondelete="CASCADE"))
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculty.id", ondelete="CASCADE"))
    course_id: Mapped[Optional[int]] = mapped_column(ForeignKey("courses.id", ondelete="CASCADE"), nullable=True)
    day_of_week: Mapped[str] = mapped_column(String(20)) # e.g. Monday, Tuesday
    start_time: Mapped[Time] = mapped_column(Time)
    end_time: Mapped[Time] = mapped_column(Time)
    room_number: Mapped[str] = mapped_column(String(50))

    # Relationships
    department: Mapped["Department"] = relationship("Department")
    subject: Mapped["Subject"] = relationship("Subject")
    faculty: Mapped["Faculty"] = relationship("Faculty")
    course_rel: Mapped[Optional["Course"]] = relationship("Course")

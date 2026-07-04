from typing import TYPE_CHECKING, Optional
from sqlalchemy import String, ForeignKey, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.course import Course
    from app.models.user import User


class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    enrollment_number: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    course_id: Mapped[Optional[int]] = mapped_column(ForeignKey("courses.id", ondelete="SET NULL"), nullable=True)
    batch: Mapped[str] = mapped_column(String(20)) # e.g. "2023-2027"
    date_of_birth: Mapped[Optional[Date]] = mapped_column(Date, nullable=True)
    contact_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="student_profile")
    course_rel: Mapped[Optional["Course"]] = relationship("Course", back_populates="students")

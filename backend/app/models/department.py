from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.course import Course
    from app.models.faculty import Faculty
    from app.models.subject import Subject


class Department(Base):
    __tablename__ = "departments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # Relationships
    faculty_members: Mapped[List["Faculty"]] = relationship("Faculty", back_populates="department")
    courses: Mapped[List["Course"]] = relationship("Course", back_populates="department")
    subjects: Mapped[List["Subject"]] = relationship("Subject", back_populates="department")

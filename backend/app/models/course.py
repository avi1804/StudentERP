from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.department import Department
    from app.models.student import Student


class Course(Base):
    __tablename__ = "courses"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id", ondelete="CASCADE"))
    description: Mapped[Optional[str]] = mapped_column(String(500), nullable=True)

    # Relationships
    department: Mapped["Department"] = relationship("Department", back_populates="courses")
    students: Mapped[List["Student"]] = relationship("Student", back_populates="course_rel")

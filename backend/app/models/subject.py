from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.department import Department
    from app.models.subject_assignment import SubjectAssignment
    from app.models.faculty import Faculty


class Subject(Base):
    __tablename__ = "subjects"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), index=True)
    code: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    credits: Mapped[int] = mapped_column(Integer)
    department_id: Mapped[int] = mapped_column(ForeignKey("departments.id", ondelete="CASCADE"))
    semester: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)
    faculty_id: Mapped[Optional[int]] = mapped_column(ForeignKey("faculty.id", ondelete="SET NULL"), nullable=True)

    # Relationships
    department: Mapped["Department"] = relationship("Department", back_populates="subjects")
    faculty: Mapped[Optional["Faculty"]] = relationship("Faculty")
    assignments: Mapped[List["SubjectAssignment"]] = relationship("SubjectAssignment", back_populates="subject", cascade="all, delete-orphan")

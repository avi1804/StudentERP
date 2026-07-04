from typing import TYPE_CHECKING, Optional, List
from sqlalchemy import String, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.department import Department
    from app.models.subject_assignment import SubjectAssignment
    from app.models.user import User


class Faculty(Base):
    __tablename__ = "faculty"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    employee_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    designation: Mapped[str] = mapped_column(String(100))
    department_id: Mapped[Optional[int]] = mapped_column(ForeignKey("departments.id", ondelete="SET NULL"), nullable=True)
    contact_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    
    # Relationships
    user: Mapped["User"] = relationship("User", back_populates="faculty_profile")
    department: Mapped[Optional["Department"]] = relationship("Department", back_populates="faculty_members")
    assignments: Mapped[List["SubjectAssignment"]] = relationship("SubjectAssignment", back_populates="faculty", cascade="all, delete-orphan")

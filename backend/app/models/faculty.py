from typing import Optional, List
from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

class Faculty(Base):
    __tablename__ = "faculty"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    employee_id: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    designation: Mapped[str] = mapped_column(String(100))
    department_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True) # Will link to Department later
    contact_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    
    # user = relationship("User", backref="faculty_profile")

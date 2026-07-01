from typing import Optional, List
from sqlalchemy import String, Integer, ForeignKey, Date
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

class Student(Base):
    __tablename__ = "students"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), unique=True)
    enrollment_number: Mapped[str] = mapped_column(String(50), unique=True, index=True)
    course: Mapped[str] = mapped_column(String(100))
    batch: Mapped[str] = mapped_column(String(20)) # e.g. "2023-2027"
    date_of_birth: Mapped[Optional[Date]] = mapped_column(Date, nullable=True)
    contact_number: Mapped[Optional[str]] = mapped_column(String(20), nullable=True)
    
    # Relationships will be added later
    # user = relationship("User", backref="student_profile")

from typing import TYPE_CHECKING
from sqlalchemy import String, ForeignKey, DateTime
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base
from datetime import datetime

if TYPE_CHECKING:
    from app.models.faculty import Faculty
    from app.models.student import Student

class QRSession(Base):
    __tablename__ = "qr_sessions"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    lecture_instance_id: Mapped[str] = mapped_column(String(100), index=True, nullable=False)
    token: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    generated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    expires_at: Mapped[datetime] = mapped_column(DateTime, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="active") # active, expired
    faculty_id: Mapped[int] = mapped_column(ForeignKey("faculty.id", ondelete="CASCADE"))

    # Relationships
    faculty: Mapped["Faculty"] = relationship("Faculty")


class QRScanLog(Base):
    __tablename__ = "qr_scan_logs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    qr_session_id: Mapped[int] = mapped_column(ForeignKey("qr_sessions.id", ondelete="CASCADE"), index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), index=True)
    scanned_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    result: Mapped[str] = mapped_column(String(50)) # success, expired, duplicate, mismatch

    # Relationships
    qr_session: Mapped["QRSession"] = relationship("QRSession")
    student: Mapped["Student"] = relationship("Student")

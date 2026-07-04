from datetime import datetime
from typing import TYPE_CHECKING, Optional
from sqlalchemy import String, DateTime, ForeignKey, Boolean, JSON
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.faculty import Faculty
    from app.models.subject_assignment import SubjectAssignment
    from app.models.user import User


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[Optional[int]] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True, index=True)
    action: Mapped[str] = mapped_column(String(255))
    entity: Mapped[str] = mapped_column(String(255))
    entity_id: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    details: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    ip_address: Mapped[Optional[str]] = mapped_column(String(50), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    user: Mapped[Optional["User"]] = relationship("User")


class DashboardStat(Base):
    """Pre-computed or cached stats for the dashboard"""
    __tablename__ = "dashboard_stats"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    metric_name: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    metric_value: Mapped[dict] = mapped_column(JSON)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)


class ImportExportHistory(Base):
    __tablename__ = "import_export_history"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    action_type: Mapped[str] = mapped_column(String(50)) # IMPORT, EXPORT
    entity: Mapped[str] = mapped_column(String(100)) # e.g. Attendance, Marks
    file_name: Mapped[str] = mapped_column(String(255))
    status: Mapped[str] = mapped_column(String(50)) # SUCCESS, FAILED, PENDING
    error_report: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    user: Mapped["User"] = relationship("User")


class SystemSetting(Base):
    __tablename__ = "system_settings"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    key: Mapped[str] = mapped_column(String(100), unique=True, index=True)
    value: Mapped[dict] = mapped_column(JSON)


class SubstituteFacultyAssignment(Base):
    __tablename__ = "substitute_faculty_assignments"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    original_faculty_id: Mapped[int] = mapped_column(ForeignKey("faculty.id", ondelete="CASCADE"), index=True)
    substitute_faculty_id: Mapped[int] = mapped_column(ForeignKey("faculty.id", ondelete="CASCADE"), index=True)
    subject_assignment_id: Mapped[int] = mapped_column(ForeignKey("subject_assignments.id", ondelete="CASCADE"))
    start_date: Mapped[datetime] = mapped_column(DateTime)
    end_date: Mapped[datetime] = mapped_column(DateTime)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_by: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    original_faculty: Mapped["Faculty"] = relationship("Faculty", foreign_keys=[original_faculty_id])
    substitute_faculty: Mapped["Faculty"] = relationship("Faculty", foreign_keys=[substitute_faculty_id])
    subject_assignment: Mapped["SubjectAssignment"] = relationship("SubjectAssignment")

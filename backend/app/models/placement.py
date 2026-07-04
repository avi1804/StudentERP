from datetime import date, datetime
from typing import TYPE_CHECKING, List, Optional
from sqlalchemy import String, DateTime, ForeignKey, Date, Enum as SQLEnum, Float
import enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

if TYPE_CHECKING:
    from app.models.student import Student


class PlacementCompany(Base):
    __tablename__ = "placement_companies"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(255), index=True)
    industry: Mapped[str] = mapped_column(String(100))
    website: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    contact_email: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)

    # Relationships
    drives: Mapped[List["PlacementDrive"]] = relationship("PlacementDrive", back_populates="company", cascade="all, delete-orphan")


class PlacementDrive(Base):
    __tablename__ = "placement_drives"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    company_id: Mapped[int] = mapped_column(ForeignKey("placement_companies.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    description: Mapped[str] = mapped_column(String)
    drive_date: Mapped[date] = mapped_column(Date)
    registration_deadline: Mapped[datetime] = mapped_column(DateTime)
    eligibility_cgpa: Mapped[float] = mapped_column(Float, default=0.0)
    package_offered: Mapped[Optional[str]] = mapped_column(String(100), nullable=True)

    # Relationships
    company: Mapped["PlacementCompany"] = relationship("PlacementCompany", back_populates="drives")
    applications: Mapped[List["PlacementApplication"]] = relationship("PlacementApplication", back_populates="drive", cascade="all, delete-orphan")


class ApplicationStatus(str, enum.Enum):
    APPLIED = "APPLIED"
    SHORTLISTED = "SHORTLISTED"
    INTERVIEW = "INTERVIEW"
    SELECTED = "SELECTED"
    REJECTED = "REJECTED"

class PlacementApplication(Base):
    __tablename__ = "placement_applications"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    drive_id: Mapped[int] = mapped_column(ForeignKey("placement_drives.id", ondelete="CASCADE"), index=True)
    student_id: Mapped[int] = mapped_column(ForeignKey("students.id", ondelete="CASCADE"), index=True)
    status: Mapped[ApplicationStatus] = mapped_column(SQLEnum(ApplicationStatus), default=ApplicationStatus.APPLIED)
    applied_on: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    # Relationships
    drive: Mapped["PlacementDrive"] = relationship("PlacementDrive", back_populates="applications")
    student: Mapped["Student"] = relationship("Student")

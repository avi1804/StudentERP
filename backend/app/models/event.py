from datetime import datetime
from typing import Optional
from sqlalchemy import String, DateTime, ForeignKey, Text, Enum as SQLEnum
import enum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from app.database.base import Base

class EventStatus(str, enum.Enum):
    DRAFT = "DRAFT"
    PUBLISHED = "PUBLISHED"
    CANCELLED = "CANCELLED"

class Event(Base):
    __tablename__ = "events"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(255), index=True)
    description: Mapped[str] = mapped_column(Text)
    category: Mapped[str] = mapped_column(String(100))
    
    start_date_time: Mapped[datetime] = mapped_column(DateTime)
    end_date_time: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    
    venue: Mapped[str] = mapped_column(String(255))
    department: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    banner_image_url: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    
    contact_name: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    contact_info: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    
    eligibility: Mapped[Optional[str]] = mapped_column(String(255), nullable=True)
    registration_link: Mapped[Optional[str]] = mapped_column(String(1000), nullable=True)
    
    status: Mapped[EventStatus] = mapped_column(SQLEnum(EventStatus), default=EventStatus.DRAFT)
    
    created_by: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    creator = relationship("User")

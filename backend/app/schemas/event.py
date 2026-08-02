from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.models.event import EventStatus

class EventBase(BaseModel):
    title: str
    description: str
    category: str
    start_date_time: datetime
    end_date_time: Optional[datetime] = None
    venue: str
    department: Optional[str] = None
    banner_image_url: Optional[str] = None
    contact_name: Optional[str] = None
    contact_info: Optional[str] = None
    eligibility: Optional[str] = None
    registration_link: Optional[str] = None

class EventCreate(EventBase):
    pass

class EventUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[str] = None
    start_date_time: Optional[datetime] = None
    end_date_time: Optional[datetime] = None
    venue: Optional[str] = None
    department: Optional[str] = None
    banner_image_url: Optional[str] = None
    contact_name: Optional[str] = None
    contact_info: Optional[str] = None
    eligibility: Optional[str] = None
    registration_link: Optional[str] = None
    status: Optional[EventStatus] = None

class EventOut(EventBase):
    id: int
    status: EventStatus
    created_by: Optional[int] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

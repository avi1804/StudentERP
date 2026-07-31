from typing import Optional
from pydantic import BaseModel
from datetime import datetime
from app.models.communication import NoticeCategory, ComplaintStatus, ComplaintPriority

class NoticeBase(BaseModel):
    title: str
    content: str
    category: NoticeCategory
    is_active: bool = True

class NoticeCreate(NoticeBase):
    pass

class NoticeUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    category: Optional[NoticeCategory] = None
    is_active: Optional[bool] = None

class NoticeResponse(NoticeBase):
    id: int
    author_id: int
    created_at: datetime
    author_name: Optional[str] = "Admin"
    model_config = {"from_attributes": True}


class NotificationBase(BaseModel):
    user_id: int
    title: str
    message: str

class NotificationCreate(NotificationBase):
    pass

class NotificationUpdate(BaseModel):
    is_read: Optional[bool] = None

class NotificationResponse(NotificationBase):
    id: int
    is_read: bool
    created_at: datetime
    model_config = {"from_attributes": True}


class ComplaintBase(BaseModel):
    subject: str
    description: str
    category: Optional[str] = "General"
    priority: ComplaintPriority = ComplaintPriority.MEDIUM

class ComplaintCreate(BaseModel):
    subject: str
    description: str
    category: Optional[str] = "General"
    priority: ComplaintPriority = ComplaintPriority.MEDIUM

class ComplaintUpdateStatus(BaseModel):
    status: Optional[ComplaintStatus] = None
    priority: Optional[ComplaintPriority] = None
    resolution: Optional[str] = None
    assigned_to: Optional[int] = None

ComplaintUpdate = ComplaintUpdateStatus

class ComplaintResponse(ComplaintBase):
    id: int
    ticket_number: str
    student_id: int
    category: Optional[str] = "General"
    resolution: Optional[str] = None
    status: ComplaintStatus
    priority: ComplaintPriority
    assigned_to: Optional[int] = None
    created_at: datetime
    updated_at: datetime
    student_name: Optional[str] = None
    student_enrollment: Optional[str] = None
    model_config = {"from_attributes": True}

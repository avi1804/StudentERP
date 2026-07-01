from typing import Optional
from datetime import datetime
from pydantic import BaseModel

class NoticeBase(BaseModel):
    title: str
    content: str
    is_active: bool = True

class NoticeCreate(NoticeBase):
    pass

class NoticeUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    is_active: Optional[bool] = None

class NoticeResponse(NoticeBase):
    id: int
    author_id: int
    created_at: datetime
    
    model_config = {"from_attributes": True}

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select
from typing import Any, List
from datetime import datetime

from app.dependencies.database import get_db
from app.models.user import User
from app.dependencies.auth import get_current_active_user, RequireRole
from app.models.event import Event, EventStatus
from app.schemas.event import EventCreate, EventUpdate, EventOut
from app.models.communication import Notice, NoticeCategory

router = APIRouter()

@router.get("/", response_model=List[EventOut])
async def list_events(
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    # Admin gets all events, others get only PUBLISHED, CANCELLED
    if current_user.is_superuser or (hasattr(current_user, 'role') and current_user.role and current_user.role.name == "Admin"):
        result = await db.execute(select(Event).order_by(Event.start_date_time.desc()))
    else:
        result = await db.execute(
            select(Event)
            .where(Event.status.in_([EventStatus.PUBLISHED, EventStatus.CANCELLED]))
            .order_by(Event.start_date_time.desc())
        )
    return result.scalars().all()

@router.get("/{id}", response_model=EventOut)
async def get_event(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    result = await db.execute(select(Event).where(Event.id == id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    is_admin = current_user.is_superuser or (hasattr(current_user, 'role') and current_user.role and current_user.role.name == "Admin")
    if not is_admin and event.status == EventStatus.DRAFT:
        raise HTTPException(status_code=403, detail="Not enough permissions")
        
    return event

@router.post("/", response_model=EventOut)
async def create_event(
    *,
    db: AsyncSession = Depends(get_db),
    event_in: EventCreate,
    current_user: User = Depends(RequireRole(["Admin"]))
) -> Any:
    event = Event(**event_in.model_dump(), created_by=current_user.id)
    db.add(event)
    await db.commit()
    await db.refresh(event)
    
    # If published immediately, send notice
    if event.status == EventStatus.PUBLISHED:
        notice = Notice(
            title=f"New Event: {event.title}",
            content=f"A new event '{event.title}' has been scheduled on {event.start_date_time.strftime('%Y-%m-%d %H:%M')}. {event.description}",
            category=NoticeCategory.EVENT,
            author_id=current_user.id
        )
        db.add(notice)
        await db.commit()
        
    return event

@router.put("/{id}", response_model=EventOut)
async def update_event(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    event_in: EventUpdate,
    current_user: User = Depends(RequireRole(["Admin"]))
) -> Any:
    result = await db.execute(select(Event).where(Event.id == id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    old_status = event.status
    update_data = event_in.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(event, field, value)
        
    db.add(event)
    await db.commit()
    await db.refresh(event)
    
    # Check if newly published
    if old_status == EventStatus.DRAFT and event.status == EventStatus.PUBLISHED:
        notice = Notice(
            title=f"New Event: {event.title}",
            content=f"A new event '{event.title}' has been scheduled on {event.start_date_time.strftime('%Y-%m-%d %H:%M')}. {event.description}",
            category=NoticeCategory.EVENT,
            author_id=current_user.id
        )
        db.add(notice)
        await db.commit()
    
    # Or cancelled
    elif old_status == EventStatus.PUBLISHED and event.status == EventStatus.CANCELLED:
        notice = Notice(
            title=f"Event Cancelled: {event.title}",
            content=f"The event '{event.title}' previously scheduled on {event.start_date_time.strftime('%Y-%m-%d %H:%M')} has been cancelled.",
            category=NoticeCategory.EVENT,
            author_id=current_user.id
        )
        db.add(notice)
        await db.commit()
        
    return event

@router.delete("/{id}")
async def delete_event(
    *,
    db: AsyncSession = Depends(get_db),
    id: int,
    current_user: User = Depends(RequireRole(["Admin"]))
) -> Any:
    result = await db.execute(select(Event).where(Event.id == id))
    event = result.scalar_one_or_none()
    if not event:
        raise HTTPException(status_code=404, detail="Event not found")
        
    await db.delete(event)
    await db.commit()
    return {"status": "success"}

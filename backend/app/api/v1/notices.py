from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List

from app.schemas.communication import NoticeCreate, NoticeResponse, NoticeUpdate
from app.repositories.communication import notice_repo
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.models.user import User, Role
from app.core.exceptions import NotFoundException

router = APIRouter()

@router.post("/", response_model=NoticeResponse, status_code=status.HTTP_201_CREATED)
async def create_notice(
    notice_in: NoticeCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin", "faculty"]))
) -> Any:
    """
    Create new notice (Admin/Faculty).
    """
    db_obj = notice_repo.model(
        **notice_in.model_dump(),
        author_id=current_user.id
    )
    db.add(db_obj)
    await db.commit()
    await db.refresh(db_obj)
    return db_obj


from app.models.user import User

@router.get("/", response_model=List[NoticeResponse])
async def read_active_notices(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Retrieve all active notices with author names.
    """
    from sqlalchemy import select
    from app.models.communication import Notice

    stmt = (
        select(Notice, User)
        .outerjoin(User, Notice.author_id == User.id)
        .where(Notice.is_active == True)
        .order_by(Notice.created_at.desc())
        .offset(skip)
        .limit(limit)
    )
    rows = (await db.execute(stmt)).all()

    result = []
    for notice, author in rows:
        item = NoticeResponse.model_validate(notice)
        item.author_name = author.full_name if (author and author.full_name) else "Admin"
        result.append(item)

    return result


@router.put("/{id}", response_model=NoticeResponse)
async def update_notice(
    id: int,
    notice_in: NoticeUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin", "faculty"]))
) -> Any:
    """
    Update a notice (Admin/Faculty).
    """
    notice = await notice_repo.get(db, id=id)
    if not notice:
        raise NotFoundException("Notice not found")
        
    return await notice_repo.update(db, db_obj=notice, obj_in=notice_in)

@router.delete("/{id}", response_model=NoticeResponse)
async def delete_notice(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    """
    Delete a notice (Admin only).
    """
    notice = await notice_repo.get(db, id=id)
    if not notice:
        raise NotFoundException("Notice not found")
        
    return await notice_repo.remove(db, id=id)

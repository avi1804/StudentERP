from typing import Optional
from sqlalchemy import select
from sqlalchemy.orm import joinedload
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.base import CRUDBase
from app.models.user import User
from app.schemas.user import UserCreate, UserUpdate
from app.core.security import get_password_hash

class UserRepository(CRUDBase[User, UserCreate, UserUpdate]):
    async def get(self, db: AsyncSession, id: int) -> Optional[User]:
        result = await db.execute(
            select(User).options(joinedload(User.role)).where(User.id == id)
        )
        return result.scalars().first()

    async def get_by_email(self, db: AsyncSession, *, email: str) -> Optional[User]:
        result = await db.execute(
            select(User).options(joinedload(User.role)).where(User.email == email)
        )
        return result.scalars().first()

    async def create(self, db: AsyncSession, *, obj_in: UserCreate) -> User:
        db_obj = User(
            email=obj_in.email,
            hashed_password=get_password_hash(obj_in.password),
            full_name=obj_in.full_name,
            role_id=obj_in.role_id,
        )
        db.add(db_obj)
        await db.commit()
        await db.refresh(db_obj)
        # Load role for returned object
        return await self.get(db, id=db_obj.id)

user_repo = UserRepository(User)

from typing import Optional
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from app.crud.base import CRUDBase
from app.models.department import Department
from app.schemas.academic import DepartmentCreate, DepartmentUpdate

class DepartmentRepository(CRUDBase[Department, DepartmentCreate, DepartmentUpdate]):
    async def get_by_name(self, db: AsyncSession, *, name: str) -> Optional[Department]:
        result = await db.execute(select(Department).where(Department.name == name))
        return result.scalars().first()

department_repo = DepartmentRepository(Department)

from fastapi import APIRouter, Depends, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any, List

from app.schemas.academic import DepartmentCreate, DepartmentResponse, DepartmentUpdate
from app.repositories.academic import department_repo
from app.dependencies.database import get_db
from app.dependencies.auth import get_current_active_user, RequireRole
from app.models.user import User, Role
from app.core.exceptions import BadRequestException, NotFoundException

router = APIRouter()

@router.post("/", response_model=DepartmentResponse, status_code=status.HTTP_201_CREATED)
async def create_department(
    department_in: DepartmentCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    """
    Create new department (Admin only).
    """
    if await department_repo.get_by_code(db, code=department_in.code):
        raise BadRequestException("Department with this code already exists.")

    return await department_repo.create(db, obj_in=department_in)


from app.schemas.pagination import Pagination

@router.get("/", response_model=Pagination[DepartmentResponse])
async def read_departments(
    skip: int = 0,
    limit: int = 100,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Retrieve all departments.
    """
    departments = await department_repo.get_multi(db, skip=skip, limit=limit)
    total = len(departments) if departments else 0
    pages = (total + limit - 1) // limit if limit > 0 else 1
    page = (skip // limit) + 1 if limit > 0 else 1
    return Pagination(items=departments, total=total, page=page, size=limit, pages=pages)


@router.get("/{id}", response_model=DepartmentResponse)
async def read_department(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get department by ID.
    """
    department = await department_repo.get(db, id=id)
    if not department:
        raise NotFoundException("Department not found")
    return department


@router.put("/{id}", response_model=DepartmentResponse)
async def update_department(
    id: int,
    department_in: DepartmentUpdate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    """
    Update department (Admin only).
    """
    department = await department_repo.get(db, id=id)
    if not department:
        raise NotFoundException("Department not found")
        
    return await department_repo.update(db, db_obj=department, obj_in=department_in)

@router.delete("/{id}", response_model=DepartmentResponse)
async def delete_department(
    id: int,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(RequireRole(["admin"]))
) -> Any:
    """
    Delete department (Admin only).
    """
    department = await department_repo.get(db, id=id)
    if not department:
        raise NotFoundException("Department not found")
        
    return await department_repo.remove(db, id=id)

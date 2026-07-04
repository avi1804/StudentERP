from typing import Optional, List
from pydantic import BaseModel, EmailStr

class PermissionBase(BaseModel):
    name: str
    description: Optional[str] = None

class PermissionResponse(PermissionBase):
    id: int
    model_config = {"from_attributes": True}


class RoleBase(BaseModel):
    name: str
    description: Optional[str] = None

class RoleCreate(RoleBase):
    permission_ids: Optional[List[int]] = []

class RoleResponse(RoleBase):
    id: int
    permissions: List[PermissionResponse] = []
    model_config = {"from_attributes": True}


class UserBase(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None
    role_id: int


class UserCreate(UserBase):
    password: str


class UserUpdate(BaseModel):
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    password: Optional[str] = None
    role_id: Optional[int] = None
    is_active: Optional[bool] = None


class UserResponse(UserBase):
    id: int
    is_active: bool
    is_superuser: bool
    role: Optional[RoleResponse] = None

    model_config = {"from_attributes": True}

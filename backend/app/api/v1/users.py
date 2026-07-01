from fastapi import APIRouter, Depends
from typing import Any
from app.schemas.user import UserResponse
from app.models.user import User
from app.dependencies.auth import get_current_active_user

router = APIRouter()

@router.get("/me", response_model=UserResponse)
async def read_users_me(
    current_user: User = Depends(get_current_active_user)
) -> Any:
    """
    Get current user.
    """
    return current_user

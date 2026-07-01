from fastapi import Depends
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List

from app.core.config import settings
from app.core.exceptions import CredentialsException, ForbiddenException
from app.core.jwt import decode_token
from app.dependencies.database import get_db
from app.models.user import User, Role
from app.repositories.user import user_repo

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme)
) -> User:
    try:
        payload = decode_token(token)
    except ValueError as e:
        raise CredentialsException(str(e))

    if payload.get("type") != "access":
        raise CredentialsException("Invalid token type")

    user_id: str = payload.get("sub")
    if user_id is None:
        raise CredentialsException()

    user = await user_repo.get(db, id=int(user_id))
    if not user:
        raise CredentialsException("User not found")
        
    return user

async def get_current_active_user(
    current_user: User = Depends(get_current_user)
) -> User:
    if not current_user.is_active:
        raise CredentialsException("Inactive user")
    return current_user

def RequireRole(roles: List[Role]):
    async def role_checker(current_user: User = Depends(get_current_active_user)):
        if current_user.is_superuser:
            return current_user
        if current_user.role not in roles:
            raise ForbiddenException()
        return current_user
    return role_checker

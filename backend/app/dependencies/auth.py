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

def RequireRole(roles: List[str]):
    async def role_checker(
        current_user: User = Depends(get_current_active_user),
        db: AsyncSession = Depends(get_db)
    ):
        if current_user.is_superuser:
            return current_user
        
        # User role is a relationship, ensure it's loaded
        # Typically lazy loading might fail in async context, 
        # so it's better to fetch user with joinedload(User.role) in user_repo
        # but let's assume it's loaded or fetch it if needed.
        # Alternatively, rely on the token role if we embed it.
        # Assuming user_repo.get now loads 'role' relationship.
        if hasattr(current_user, 'role') and current_user.role and current_user.role.name in roles:
            return current_user
            
        raise ForbiddenException("You don't have enough permissions")
    return role_checker

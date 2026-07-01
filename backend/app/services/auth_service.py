from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from app.repositories.user import user_repo
from app.core.security import verify_password
from app.core.exceptions import CredentialsException, BadRequestException
from app.core.jwt import create_access_token, create_refresh_token, decode_token
from app.schemas.auth import Token
from app.schemas.user import UserCreate

class AuthService:
    @staticmethod
    async def authenticate(db: AsyncSession, form_data: OAuth2PasswordRequestForm) -> Token:
        user = await user_repo.get_by_email(db, email=form_data.username)
        if not user:
            raise CredentialsException("Incorrect email or password")
        
        if not verify_password(form_data.password, user.hashed_password):
            raise CredentialsException("Incorrect email or password")
            
        if not user.is_active:
            raise BadRequestException("Inactive user")

        access_token = create_access_token(subject=user.id, role=user.role.value if hasattr(user.role, 'value') else user.role)
        refresh_token = create_refresh_token(subject=user.id, role=user.role.value if hasattr(user.role, 'value') else user.role)

        return Token(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer"
        )
        
    @staticmethod
    async def refresh_token(db: AsyncSession, refresh_token: str) -> Token:
        try:
            payload = decode_token(refresh_token)
        except ValueError as e:
            raise CredentialsException(str(e))

        if payload.get("type") != "refresh":
            raise CredentialsException("Invalid token type")
            
        user_id = int(payload.get("sub"))
        user = await user_repo.get(db, id=user_id)
        
        if not user:
            raise CredentialsException("User not found")
        
        if not user.is_active:
            raise BadRequestException("Inactive user")

        access_token = create_access_token(subject=user.id, role=user.role.value if hasattr(user.role, 'value') else user.role)
        new_refresh_token = create_refresh_token(subject=user.id, role=user.role.value if hasattr(user.role, 'value') else user.role)

        return Token(
            access_token=access_token,
            refresh_token=refresh_token, # can issue a new one too
            token_type="bearer"
        )

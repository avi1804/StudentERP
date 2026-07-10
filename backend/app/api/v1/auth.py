from fastapi import APIRouter, Depends, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Any

from app.schemas.auth import Token, RefreshTokenRequest, GoogleLoginRequest, ForgotPasswordRequest, VerifyOTPRequest, ResetPasswordRequest, CheckEmailRequest
from app.schemas.user import UserCreate, UserResponse
from app.services.auth_service import AuthService
from app.repositories.user import user_repo
from app.dependencies.database import get_db
from app.core.exceptions import BadRequestException

router = APIRouter()

@router.post("/login", response_model=Token)
async def login(
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends()
) -> Any:
    """
    OAuth2 compatible token login, get an access token for future requests.
    """
    return await AuthService.authenticate(db, form_data)

@router.post("/google", response_model=Token)
async def google_login(
    request: GoogleLoginRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Login using a Google OAuth token.
    """
    return await AuthService.authenticate_google(db, request.token)

@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
async def register(
    user_in: UserCreate,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Register a new user.
    """
    user = await user_repo.get_by_email(db, email=user_in.email)
    if user:
        raise BadRequestException("A user with this email already exists.")
    user = await user_repo.create(db, obj_in=user_in)
    return user

@router.post("/refresh", response_model=Token)
async def refresh_token(
    request: RefreshTokenRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    """
    Refresh access token using refresh token.
    """
    return await AuthService.refresh_token(db, request.refresh_token)

@router.post("/forgot-password", status_code=status.HTTP_200_OK)
async def forgot_password(
    request: ForgotPasswordRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    return await AuthService.forgot_password(db, request.email)

@router.post("/verify-otp", status_code=status.HTTP_200_OK)
async def verify_otp(
    request: VerifyOTPRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    return await AuthService.verify_otp(db, request.email, request.otp)

@router.post("/reset-password", status_code=status.HTTP_200_OK)
async def reset_password(
    request: ResetPasswordRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    return await AuthService.reset_password(db, request.email, request.reset_token, request.new_password)

@router.post("/check-email", status_code=status.HTTP_200_OK)
async def check_email(
    request: CheckEmailRequest,
    db: AsyncSession = Depends(get_db)
) -> Any:
    user = await user_repo.get_by_email(db, email=request.email)
    if not user:
        raise BadRequestException("Invalid email")
    return {"message": "Email exists"}

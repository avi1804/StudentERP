from sqlalchemy.ext.asyncio import AsyncSession
from fastapi.security import OAuth2PasswordRequestForm
from app.repositories.user import user_repo
from app.core.security import verify_password
from app.core.exceptions import CredentialsException, BadRequestException
from app.core.jwt import create_access_token, create_refresh_token, decode_token
from app.schemas.auth import Token
from app.schemas.user import UserCreate
import os
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import random
import string
from datetime import datetime, timedelta, timezone
from app.services.email_service import email_service
from app.core.security import get_password_hash

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

        role_name = user.role.name if user.role else None
        access_token = create_access_token(subject=user.id, role=role_name)
        refresh_token = create_refresh_token(subject=user.id, role=role_name)

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

        role_name = user.role.name if user.role else None
        access_token = create_access_token(subject=user.id, role=role_name)
        new_refresh_token = create_refresh_token(subject=user.id, role=role_name)

        return Token(
            access_token=access_token,
            refresh_token=new_refresh_token,
            token_type="bearer"
        )

    @staticmethod
    async def authenticate_google(db: AsyncSession, token: str) -> Token:
        import requests
        try:
            # useGoogleLogin from frontend provides an access_token, not an id_token
            response = requests.get(f"https://www.googleapis.com/oauth2/v3/userinfo?access_token={token}")
            if response.status_code != 200:
                raise CredentialsException("Invalid Google access token")
                
            user_info = response.json()
            email = user_info.get("email")
            
            if not email:
                raise CredentialsException("No email provided by Google")
                
            user = await user_repo.get_by_email(db, email=email)
            if not user:
                raise CredentialsException("Your email is not registered in the StudentERP system. Please contact an administrator.")
                
            if not user.is_active:
                raise BadRequestException("Inactive user")

            role_name = user.role.name if user.role else None
            access_token = create_access_token(subject=user.id, role=role_name)
            refresh_token = create_refresh_token(subject=user.id, role=role_name)

            return Token(
                access_token=access_token,
                refresh_token=refresh_token,
                token_type="bearer"
            )
        except ValueError as e:
            # Invalid token
            raise CredentialsException(f"Invalid Google token: {str(e)}")

    @staticmethod
    async def forgot_password(db: AsyncSession, email: str) -> dict:
        user = await user_repo.get_by_email(db, email=email)
        if not user:
            # We shouldn't reveal if a user exists or not for security reasons
            return {"message": "If the email is registered, an OTP has been sent."}
        
        if not user.is_active:
            raise BadRequestException("User is inactive")
            
        # Generate 6-digit numeric OTP
        otp = ''.join(random.choices(string.digits, k=6))
        
        # Set expiry to 2 minutes from now (use naive UTC for MySQL compatibility)
        expiry = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(minutes=2)
        
        user.otp_code = otp
        user.otp_expiry = expiry
        
        db.add(user)
        await db.commit()
        
        # Trigger email send
        email_service.send_otp_email(email, otp)
        
        return {"message": "OTP sent successfully"}

    @staticmethod
    async def verify_otp(db: AsyncSession, email: str, otp: str) -> dict:
        user = await user_repo.get_by_email(db, email=email)
        if not user:
            raise BadRequestException("Invalid OTP")
            
        if not user.otp_code or user.otp_code != otp:
            raise BadRequestException("Invalid OTP")
            
        # Ensure we are comparing naive UTC datetimes
        current_time = datetime.now(timezone.utc).replace(tzinfo=None)
        if user.otp_expiry.tzinfo is not None:
            # If the database driver did return an aware datetime, convert to UTC and make naive
            user_expiry_naive = user.otp_expiry.astimezone(timezone.utc).replace(tzinfo=None)
        else:
            user_expiry_naive = user.otp_expiry

        if not user_expiry_naive or user_expiry_naive < current_time:
            raise BadRequestException("OTP has expired")
            
        # Clear the OTP since it's verified
        user.otp_code = None
        user.otp_expiry = None
        
        # We need to give them a temporary reset token so they can change their password.
        # For simplicity in this demo without creating a new table, we can generate a short-lived JWT.
        # But for absolute simplicity, we'll return a special JWT that's only good for resetting.
        # I'll use the existing create_access_token but with a special role/claim.
        
        reset_token = create_access_token(subject=user.id, role="password_reset", expires_delta=timedelta(minutes=5))
        
        db.add(user)
        await db.commit()
        
        return {"message": "OTP verified successfully", "reset_token": reset_token}

    @staticmethod
    async def reset_password(db: AsyncSession, email: str, reset_token: str, new_password: str) -> dict:
        try:
            payload = decode_token(reset_token)
        except ValueError as e:
            raise BadRequestException("Invalid or expired reset token")
            
        if payload.get("role") != "password_reset":
            raise BadRequestException("Invalid reset token")
            
        user_id = int(payload.get("sub"))
        user = await user_repo.get(db, id=user_id)
        
        if not user or user.email != email:
            raise BadRequestException("Invalid reset token")
            
        # Update the password
        user.hashed_password = get_password_hash(new_password)
        
        db.add(user)
        await db.commit()
        
        return {"message": "Password reset successfully"}

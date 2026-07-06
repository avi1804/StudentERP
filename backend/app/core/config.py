from typing import Optional, Any, Dict
from pydantic import PostgresDsn, field_validator, ValidationInfo
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "Student ERP Backend"
    API_V1_STR: str = "/api/v1"
    DEBUG: bool = False

    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    BACKEND_CORS_ORIGINS: list[str] = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]

    # Database
    DATABASE_URL: str
    DIRECT_URL: Optional[str] = None

    @field_validator("DATABASE_URL", "DIRECT_URL", mode="before")
    @classmethod
    def assemble_db_connection(cls, v: Optional[str], info: ValidationInfo) -> Any:
        if v is None and info.field_name == "DIRECT_URL":
            return v
        if isinstance(v, str):
            if v.startswith("mysql://"):
                v = v.replace("mysql://", "mysql+aiomysql://", 1)
            elif v.startswith("postgres://"):
                v = v.replace("postgres://", "postgresql://", 1)
            
            if v.startswith("postgresql://"):
                v = v.replace("postgresql://", "postgresql+asyncpg://", 1)
                
            if "?pgbouncer=true" in v:
                v = v.replace("?pgbouncer=true", "")
            return v
        raise ValueError("DATABASE_URL must be provided")

    # Initial Super User
    FIRST_SUPERUSER_EMAIL: str
    FIRST_SUPERUSER_PASSWORD: str

    # SMTP configuration
    SMTP_HOST: Optional[str] = None
    SMTP_PORT: int = 587
    SMTP_USER: Optional[str] = None
    SMTP_PASSWORD: Optional[str] = None

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", case_sensitive=True, extra="ignore")


settings = Settings()

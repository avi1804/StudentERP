from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
from app.database.session import engine
from app.database.base import Base

# Ensure all models are imported so Base.metadata knows about them
import app.models.user  # noqa
import app.models.faculty  # noqa
import app.models.student  # noqa
import app.models.subject  # noqa
import app.models.subject_assignment  # noqa
import app.models.assignment  # noqa  - registers assignments + assignment_submissions
import app.models.fee  # noqa
import app.models.communication  # noqa

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    debug=settings.DEBUG,
)

from app.middleware.audit import AuditLogMiddleware
from app.middleware.exceptions import GlobalExceptionMiddleware
from app.middleware.security import SecurityHeadersMiddleware
from app.middleware.rate_limit import RateLimitMiddleware

# Add Exception Middleware
app.add_middleware(GlobalExceptionMiddleware)

# Add Security Headers Middleware
app.add_middleware(SecurityHeadersMiddleware)

# Add Rate Limit Middleware
app.add_middleware(RateLimitMiddleware)

# Set CORS enabled origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(AuditLogMiddleware)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def on_startup():
    """Auto-create any missing tables and columns on server start."""
    from sqlalchemy import text
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all, checkfirst=True)
        try:
            await conn.execute(text("ALTER TABLE complaints ADD COLUMN category VARCHAR(100) DEFAULT 'General'"))
        except Exception:
            pass
        try:
            await conn.execute(text("ALTER TABLE complaints ADD COLUMN resolution TEXT NULL"))
        except Exception:
            pass


@app.get("/")
def root():
    return {"message": "Welcome to the Student ERP API"}

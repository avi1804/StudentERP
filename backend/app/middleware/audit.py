import time
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from app.database.session import AsyncSessionLocal
from app.models.system import AuditLog
import json
from app.core.jwt import decode_token

class AuditLogMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # We only want to log mutations
        if request.method not in ["POST", "PUT", "DELETE", "PATCH"]:
            return await call_next(request)

        # Process the request
        response = await call_next(request)

        # After the response, let's log asynchronously if successful or error
        # In a real heavy production app, use BackgroundTasks or Celery, but this is fine for basic middleware
        if request.url.path.startswith("/api/v1/auth"): # skip logging auth tokens
            return response

        user_id = None
        auth_header = request.headers.get("Authorization")
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                payload = decode_token(token)
                user_id_str = payload.get("sub")
                if user_id_str:
                    user_id = int(user_id_str)
            except Exception:
                pass

        # We'll save the audit log
        async with AsyncSessionLocal() as session:
            try:
                audit_entry = AuditLog(
                    user_id=user_id,
                    action=request.method,
                    entity=request.url.path,
                    details={
                        "status_code": response.status_code,
                        "query_params": str(request.query_params)
                    },
                    ip_address=request.client.host if request.client else None
                )
                session.add(audit_entry)
                await session.commit()
            except Exception as e:
                print(f"Failed to write audit log: {e}")

        return response

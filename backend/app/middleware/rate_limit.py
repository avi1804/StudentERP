from fastapi import Request, status
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
import time

# Simple in-memory rate limiter (Token Bucket or Sliding Window logic can be complex, so we'll use a simple window)
# For production, this should be Redis-backed using libraries like slowapi
from collections import defaultdict

# Format: { "ip_address": [timestamp1, timestamp2, ...] }
request_counts = defaultdict(list)
RATE_LIMIT_DURATION = 60 # seconds
RATE_LIMIT_REQUESTS = 100 # max requests per duration

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host if request.client else "unknown"
        now = time.time()
        
        # Clean up old requests
        request_counts[client_ip] = [t for t in request_counts[client_ip] if now - t < RATE_LIMIT_DURATION]
        
        if len(request_counts[client_ip]) >= RATE_LIMIT_REQUESTS:
            return JSONResponse(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                content={"error": {"code": "RATE_LIMIT_EXCEEDED", "message": "Too many requests. Please try again later."}}
            )
            
        request_counts[client_ip].append(now)
        return await call_next(request)

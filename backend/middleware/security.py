from fastapi import HTTPException, Security
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from starlette.middleware.base import BaseHTTPMiddleware
import time
from typing import Optional
import jwt

security = HTTPBearer()

class RateLimitMiddleware(BaseHTTPMiddleware):
    def __init__(self, app, max_requests: int = 100, window_seconds: int = 60):
        super().__init__(app)
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = {}

    async def dispatch(self, request, call_next):
        client_ip = request.client.host
        current_time = time.time()

        # Clean old requests
        self.requests = {ip: reqs for ip, reqs in self.requests.items() 
                        if current_time - reqs[-1] < self.window_seconds}

        # Check rate limit
        if client_ip in self.requests:
            requests = self.requests[client_ip]
            if len(requests) >= self.max_requests:
                raise HTTPException(status_code=429, detail="Too many requests")
            requests.append(current_time)
        else:
            self.requests[client_ip] = [current_time]

        response = await call_next(request)
        return response 
"""Simple shared-password admin auth.

The admin password is read from env `ADMIN_PASSWORD`.
On successful login the backend issues a short-lived signed token (HS256) that
the frontend attaches as `Authorization: Bearer <token>` on protected calls.
"""
from __future__ import annotations

import os
import secrets
import time
from typing import Optional

import jwt
from fastapi import Header, HTTPException, status

JWT_ALG = "HS256"
DEFAULT_TTL_SECONDS = 60 * 60 * 12  # 12h


def _secret() -> str:
    secret = os.environ.get("ADMIN_JWT_SECRET")
    if not secret:
        # Generate per-process secret if not configured. This invalidates tokens
        # on restart, which is acceptable for a single-admin CMS.
        secret = secrets.token_hex(32)
        os.environ["ADMIN_JWT_SECRET"] = secret
    return secret


def _expected_password() -> str:
    return os.environ.get("ADMIN_PASSWORD", "")


def verify_password(password: str) -> bool:
    expected = _expected_password()
    if not expected:
        # Fail-closed: if admin password isn't configured, no login works
        return False
    # Constant-time compare
    return secrets.compare_digest(password, expected)


def issue_token(ttl_seconds: int = DEFAULT_TTL_SECONDS) -> str:
    now = int(time.time())
    payload = {
        "role": "admin",
        "iat": now,
        "exp": now + ttl_seconds,
    }
    return jwt.encode(payload, _secret(), algorithm=JWT_ALG)


def _decode(token: str) -> dict:
    try:
        return jwt.decode(token, _secret(), algorithms=[JWT_ALG])
    except jwt.ExpiredSignatureError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Token expired") from e
    except jwt.InvalidTokenError as e:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from e


def require_admin(authorization: Optional[str] = Header(default=None)) -> dict:
    """FastAPI dependency. Expects `Authorization: Bearer <token>` header."""
    if not authorization or not authorization.lower().startswith("bearer "):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing Bearer token",
        )
    token = authorization.split(" ", 1)[1].strip()
    payload = _decode(token)
    if payload.get("role") != "admin":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role")
    return payload

"""
Auth Module - Pydantic Schemas
"""

from typing import Any, Dict, List

from pydantic import BaseModel, EmailStr


class Auth0UserProfile(BaseModel):
    """Pydantic model for the user profile data coming from Auth0."""

    user_id: str
    email: EmailStr
    name: str | None = None
    given_name: str | None = None
    nickname: str | None = None
    picture: str | None = None
    email_verified: bool | None = None
    app_metadata: Dict[str, Any] = {}
    user_metadata: Dict[str, Any] = {}


class Auth0User(BaseModel):
    """Pydantic model for the main user object in the Auth0 webhook payload."""

    user: Auth0UserProfile


class Auth0WebhookResponse(BaseModel):
    """Response model for the Auth0 webhook endpoint."""

    message: str
    id: str
    device_ids: List[str]
    role: str

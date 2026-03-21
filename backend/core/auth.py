"""
Auth0 ID Token verification using RS256 + JWKS.
"""

from typing import Annotated

import jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jwt import PyJWKClient

from .config import settings

_jwks_client = PyJWKClient(
    f"https://{settings.auth0_domain}/.well-known/jwks.json",
    cache_keys=True,
)

_bearer_scheme = HTTPBearer()


def verify_id_token(token: str) -> dict:
    """Verify an Auth0 id_token and return the decoded payload."""
    signing_key = _jwks_client.get_signing_key_from_jwt(token)
    payload = jwt.decode(
        token,
        signing_key.key,
        algorithms=["RS256"],
        audience=settings.auth0_client_id,
        issuer=f"https://{settings.auth0_domain}/",
    )
    return payload


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer_scheme),
) -> dict:
    """FastAPI dependency: extract and verify id_token from Authorization header."""
    try:
        return verify_id_token(credentials.credentials)
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
        )
    except jwt.InvalidTokenError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Invalid token: {e}",
        )


CurrentUserDep = Annotated[dict, Depends(get_current_user)]

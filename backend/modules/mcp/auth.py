"""
API Key authentication for the MCP module.

Auth is performed once at connection time by the ASGI middleware.
The validated AuthResult is stored in a ContextVar so tool functions
can access it without requiring an api_key parameter.
"""

import hashlib
from contextvars import ContextVar

from core.hasura_client import TimedGraphQLClient
from gql import gql

from .schemas import AuthResult

_current_auth: ContextVar[AuthResult | None] = ContextVar("_current_auth", default=None)


def set_current_auth(auth: AuthResult) -> None:
    """Store the authenticated result for the current request."""
    _current_auth.set(auth)


def get_current_auth() -> AuthResult:
    """Retrieve the authenticated result for the current request.

    Raises:
        ValueError: If no auth has been set (middleware not applied).
    """
    auth = _current_auth.get()
    if auth is None:
        raise ValueError("Not authenticated — missing API key")
    return auth

VALIDATE_KEY_QUERY = gql(
    """
    query ValidateApiKey($key_hash: String!) {
        api_keys(
            where: { key_hash: { _eq: $key_hash }, is_active: { _eq: true } }
            limit: 1
        ) {
            id
            user_id
        }
    }
"""
)

UPDATE_LAST_USED = gql(
    """
    mutation UpdateLastUsed($key_id: uuid!) {
        update_api_keys_by_pk(
            pk_columns: { id: $key_id }
            _set: { last_used_at: "now()" }
        ) {
            id
        }
    }
"""
)


async def validate_api_key(raw_key: str) -> AuthResult:
    """
    Validate an API key by hashing and looking up in the database.

    Raises:
        ValueError: If the key is invalid or inactive.
    """
    if not raw_key or not raw_key.startswith("avo_"):
        raise ValueError("Invalid API key format")

    key_hash = hashlib.sha256(raw_key.encode()).hexdigest()
    _client = TimedGraphQLClient()

    data = await _client.execute(
        VALIDATE_KEY_QUERY,
        variable_values={"key_hash": key_hash},
    )

    keys = data.get("api_keys", [])
    if not keys:
        raise ValueError("Invalid or inactive API key")

    api_key = keys[0]

    # Update last_used_at
    await _client.execute(
        UPDATE_LAST_USED,
        variable_values={"key_id": api_key["id"]},
    )

    return AuthResult(
        user_id=api_key["user_id"],
        api_key_id=api_key["id"],
    )

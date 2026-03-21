"""
ASGI middleware that authenticates MCP connections via API key.

Expects the API key in the Authorization header:
    Authorization: Bearer avo_xxx

On success, stores the AuthResult in a ContextVar so downstream
tool functions can read it via get_current_auth().
"""

import json
from typing import Any, Callable

from .auth import set_current_auth, validate_api_key

Scope = dict[str, Any]
Receive = Callable[..., Any]
Send = Callable[..., Any]


def _get_bearer_token(scope: Scope) -> str | None:
    """Extract Bearer token from the ASGI scope headers."""
    headers = dict(scope.get("headers", []))
    auth_value = headers.get(b"authorization", b"").decode()
    if auth_value.lower().startswith("bearer "):
        return auth_value[7:].strip()
    return None


async def _send_json_response(send: Send, status: int, body: dict) -> None:
    """Send a simple JSON HTTP response."""
    payload = json.dumps(body).encode()
    await send(
        {
            "type": "http.response.start",
            "status": status,
            "headers": [
                [b"content-type", b"application/json"],
                [b"content-length", str(len(payload)).encode()],
            ],
        }
    )
    await send({"type": "http.response.body", "body": payload})


class ApiKeyAuthMiddleware:
    """ASGI middleware that validates an API key before forwarding to the MCP app."""

    def __init__(self, app: Any) -> None:
        self.app = app

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self.app(scope, receive, send)
            return

        token = _get_bearer_token(scope)
        if not token:
            await _send_json_response(
                send, 401, {"error": "Missing Authorization header. Use: Bearer <api_key>"}
            )
            return

        try:
            auth_result = await validate_api_key(token)
        except ValueError as exc:
            await _send_json_response(send, 401, {"error": str(exc)})
            return

        set_current_auth(auth_result)
        await self.app(scope, receive, send)

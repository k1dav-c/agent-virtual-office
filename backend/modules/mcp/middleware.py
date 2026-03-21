"""
ASGI middleware that authenticates MCP connections via API key.

Accepts the API key from either source (checked in order):
  1. Query parameter:  ?api_key=avo_xxx
  2. Authorization header:  Authorization: Bearer avo_xxx

Query-param mode is the primary method because Claude Desktop
does not support custom HTTP headers in MCP server config.

On success, stores the AuthResult in a ContextVar so downstream
tool functions can read it via get_current_auth().
"""

import json
from typing import Any, Callable
from urllib.parse import parse_qs

from .auth import set_current_auth, validate_api_key

Scope = dict[str, Any]
Receive = Callable[..., Any]
Send = Callable[..., Any]


def _get_api_key(scope: Scope) -> str | None:
    """Extract API key from query string or Authorization header."""
    # 1. Query param: ?api_key=avo_xxx
    qs = scope.get("query_string", b"").decode()
    params = parse_qs(qs)
    if "api_key" in params:
        return params["api_key"][0]

    # 2. Authorization: Bearer avo_xxx
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

        token = _get_api_key(scope)
        if not token:
            await _send_json_response(
                send, 401, {"error": "Missing API key. Use ?api_key=avo_xxx or Authorization: Bearer avo_xxx"}
            )
            return

        try:
            auth_result = await validate_api_key(token)
        except ValueError as exc:
            await _send_json_response(send, 401, {"error": str(exc)})
            return

        set_current_auth(auth_result)
        await self.app(scope, receive, send)

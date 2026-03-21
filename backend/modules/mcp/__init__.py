"""
MCP Module

Provides the MCPServer (v2 SDK) that Claude Code sessions connect to.
Mounted as an ASGI sub-app on the FastAPI backend, wrapped with API key
authentication middleware.

The session manager must be started via FastAPI's lifespan because
mounted sub-apps don't receive ASGI lifespan events from FastAPI.
"""

from .middleware import ApiKeyAuthMiddleware
from .server import mcp

# Build the Starlette app once at import time; grab the session manager
# so main.py can start it inside FastAPI's lifespan context.
_starlette_app = mcp.streamable_http_app()
session_manager = mcp._lowlevel_server._session_manager


def create_mcp_app():
    """Create the MCP ASGI app wrapped with API key auth middleware."""
    return ApiKeyAuthMiddleware(_starlette_app)


__all__ = ["mcp", "session_manager", "create_mcp_app"]

"""
MCP Module

Provides the MCPServer (v2 SDK) that Claude Code sessions connect to.
Mounted as an ASGI sub-app on the FastAPI backend, wrapped with API key
authentication middleware.
"""

from .middleware import ApiKeyAuthMiddleware
from .server import mcp


def create_mcp_app():
    """Create the MCP ASGI app wrapped with API key auth middleware."""
    return ApiKeyAuthMiddleware(mcp.streamable_http_app())


__all__ = ["mcp", "create_mcp_app"]

"""
FastAPI Application Entry Point
"""

from contextlib import asynccontextmanager

from core.logger import logger
from core.rabbitmq import rabbitmq_connection
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from modules import auth
from modules.mcp import create_mcp_app


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Handles application startup and shutdown events."""
    logger.info("Starting FastAPI application")
    try:
        await rabbitmq_connection.connect()
        logger.info("RabbitMQ connection established")
    except Exception as error:
        logger.error("Failed to initialize RabbitMQ", extra={"error": str(error)})

    yield

    logger.info("Shutting down FastAPI application")
    await rabbitmq_connection.close()


app = FastAPI(
    title="Agent Virtual Office",
    description="FastAPI backend with Auth0, RabbitMQ, Hasura, and MCP server.",
    version="1.0.0",
    lifespan=lifespan,
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, restrict this to your frontend's domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include module routers
app.include_router(auth.router, prefix="/api/auth", tags=["Authentication"])

# Mount MCP server as ASGI sub-app at /mcp (v2 SDK — Streamable HTTP)
# Wrapped with ApiKeyAuthMiddleware — requires Authorization: Bearer <api_key>
app.mount("/mcp", create_mcp_app())


@app.get("/", tags=["General"])
async def root():
    """Root endpoint providing a welcome message."""
    return {"message": "Agent Virtual Office is running!"}


@app.get("/health", tags=["General"])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

"""
FastAPI Application Entry Point
"""

from contextlib import asynccontextmanager

from core.logger import logger
from core.rabbitmq import rabbitmq_connection
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from modules import auth


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
    title="FastAPI Auth0 Template",
    description="A template for FastAPI with Auth0, RabbitMQ, and Hasura.",
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


@app.get("/", tags=["General"])
async def root():
    """Root endpoint providing a welcome message."""
    return {"message": "FastAPI Auth0 Template is running!"}


@app.get("/health", tags=["General"])
async def health_check():
    """Health check endpoint."""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

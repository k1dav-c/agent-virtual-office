"""
FastAPI Dependencies

This module provides dependency injection for the application.
"""

from typing import Annotated

from fastapi import Depends

from .context import AppContext
from .hasura_client import TimedGraphQLClient
from .logger import logger
from .rabbitmq import rabbitmq_producer


async def get_context() -> AppContext:
    """Provides an application context as a dependency."""
    return AppContext(logger, rabbitmq_producer)


def get_hasura_client() -> TimedGraphQLClient:
    """Provides a Hasura GraphQL client as a dependency."""
    return TimedGraphQLClient()


# Type alias for the application context dependency
ContextDep = Annotated[AppContext, Depends(get_context)]

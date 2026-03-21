"""
Auth Module - RabbitMQ Consumers
"""

from typing import Any, Dict

from core.context import AppContext
from core.logger import logger
from core.rabbitmq import rabbitmq_producer

from .schemas import Auth0User
from .services import AuthService


async def auth0_webhook_received_consumer(input_data: Dict[str, Any]) -> None:
    """
    Handles the 'auth0.webhook.received' event.

    This consumer is responsible for creating or updating a user in the local
    database when a corresponding event is received from the Auth0 webhook.
    """
    ctx = AppContext(logger, rabbitmq_producer)
    try:
        webhook_data = Auth0User(**input_data)
        ctx.logger.info(
            "Processing Auth0 user event from consumer...",
            extra={
                "user_id": webhook_data.user.user_id,
                "email": webhook_data.user.email,
            },
        )

        # Create or update the user in the database
        await AuthService.upsert_user(webhook_data.user, ctx)

        ctx.logger.info(
            "Auth0 user event processed successfully by consumer.",
            extra={"user_id": webhook_data.user.user_id},
        )

    except Exception as error:
        ctx.logger.error(
            "Error processing Auth0 user event in consumer",
            extra={
                "error": str(error),
                "input_data": input_data,
            },
        )

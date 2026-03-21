"""
Application Context

Provides a context class for sharing resources like loggers and producers.
"""

from typing import Any, Dict

from .logger import AppLogger
from .rabbitmq import RabbitMQProducer


class AppContext:
    """Application context that can be used across the application."""

    def __init__(self, logger: AppLogger, rabbitmq_producer: RabbitMQProducer):
        self.logger = logger
        self._rabbitmq_producer = rabbitmq_producer

    async def emit(self, event: Dict[str, Any]) -> None:
        """
        Emits an event to RabbitMQ.

        Args:
            event: A dictionary containing 'topic' and 'data' keys.
        """
        topic = event.get("topic")
        data = event.get("data")

        if not topic:
            self.logger.error("Event topic is required", extra={"event": event})
            return

        try:
            await self._rabbitmq_producer.publish(topic, data)
            self.logger.debug(
                "Event emitted successfully",
                extra={"topic": topic, "data_type": type(data).__name__},
            )
        except Exception as error:
            self.logger.error(
                "Failed to emit event", extra={"topic": topic, "error": str(error)}
            )
            raise

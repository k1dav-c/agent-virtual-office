"""
RabbitMQ Connection and Message Handling

This module provides classes for managing RabbitMQ connections, producing messages,
and consuming messages.
"""

import json
from typing import Any, Callable, Dict

import aio_pika
from aio_pika import Channel, Connection, Exchange, Message, Queue
from aio_pika.abc import AbstractIncomingMessage

from .config import settings
from .logger import logger


class RabbitMQConnection:
    """Manages the connection to RabbitMQ."""

    def __init__(self):
        self.connection: Connection | None = None
        self.channel: Channel | None = None
        self.exchange: Exchange | None = None

    async def connect(self) -> None:
        """Establishes a robust connection to RabbitMQ and declares an exchange."""
        try:
            connection_url = f"amqp://{settings.rabbitmq_user}:{settings.rabbitmq_password}@{settings.rabbitmq_host}:{settings.rabbitmq_port}/{settings.rabbitmq_vhost}"
            self.connection = await aio_pika.connect_robust(connection_url)
            self.channel = await self.connection.channel()
            self.exchange = await self.channel.declare_exchange(
                "api.events", aio_pika.ExchangeType.TOPIC, durable=True
            )
            logger.info(
                "Connected to RabbitMQ",
                extra={"host": settings.rabbitmq_host, "port": settings.rabbitmq_port},
            )
        except Exception as error:
            logger.error("Failed to connect to RabbitMQ", extra={"error": str(error)})
            raise

    async def close(self) -> None:
        """Closes the RabbitMQ connection and channel."""
        try:
            if self.channel:
                await self.channel.close()
            if self.connection:
                await self.connection.close()
            logger.info("RabbitMQ connection closed.")
        except Exception as error:
            logger.error(
                "Error closing RabbitMQ connection", extra={"error": str(error)}
            )


class RabbitMQProducer:
    """Handles publishing messages to RabbitMQ."""

    def __init__(self, rabbitmq_connection: RabbitMQConnection):
        self.rabbitmq_connection = rabbitmq_connection

    async def publish(self, topic: str, data: Any) -> None:
        """
        Serializes and publishes a message to a specific topic.

        Args:
            topic: The topic/routing key for the message.
            data: The message data, which will be JSON serialized.
        """
        if not self.rabbitmq_connection.exchange:
            raise RuntimeError("RabbitMQ exchange not initialized")

        try:
            if hasattr(data, "model_dump"):
                message_body = json.dumps(data.model_dump(), ensure_ascii=False)
            else:
                message_body = json.dumps(data, ensure_ascii=False)

            message = Message(
                body=message_body.encode(),
                content_type="application/json",
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
            )

            await self.rabbitmq_connection.exchange.publish(message, routing_key=topic)
            logger.debug("Message published", extra={"topic": topic})
        except Exception as error:
            logger.error(
                "Failed to publish message", extra={"topic": topic, "error": str(error)}
            )
            raise


class RabbitMQConsumer:
    """Handles consuming messages from RabbitMQ."""

    def __init__(self, rabbitmq_connection: RabbitMQConnection):
        self.rabbitmq_connection = rabbitmq_connection
        self.handlers: Dict[str, Callable] = {}

    def register_handler(self, topic: str, handler: Callable) -> None:
        """Registers a handler for a specific topic."""
        self.handlers[topic] = handler
        logger.info("Handler registered", extra={"topic": topic})

    async def start_consuming(self) -> None:
        """Declares queues for all registered handlers and starts consuming."""
        if not self.rabbitmq_connection.channel:
            raise RuntimeError("RabbitMQ channel not initialized")

        for topic, handler in self.handlers.items():
            queue_name = f"queue.{topic}"
            queue = await self.rabbitmq_connection.channel.declare_queue(
                queue_name, durable=True
            )
            await queue.bind(self.rabbitmq_connection.exchange, routing_key=topic)
            await queue.consume(
                lambda message, h=handler: self._process_message(message, h)
            )
            logger.info(
                "Started consuming from queue",
                extra={"topic": topic, "queue": queue_name},
            )

    async def _process_message(
        self, message: AbstractIncomingMessage, handler: Callable
    ) -> None:
        """Deserializes and processes an incoming message."""
        async with message.process():
            try:
                data = json.loads(message.body.decode())
                await handler(data)
                logger.debug(
                    "Message processed successfully",
                    extra={"routing_key": message.routing_key},
                )
            except Exception as error:
                logger.error(
                    "Error processing message",
                    extra={"routing_key": message.routing_key, "error": str(error)},
                )


# Global instances to be used across the application
rabbitmq_connection = RabbitMQConnection()
rabbitmq_producer = RabbitMQProducer(rabbitmq_connection)
rabbitmq_consumer = RabbitMQConsumer(rabbitmq_connection)

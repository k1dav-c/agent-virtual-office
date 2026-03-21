"""
RabbitMQ Consumer Worker

This is an independent process that consumes events from RabbitMQ and handles them.
"""

import asyncio
import signal
import sys

from core.logger import logger
from core.rabbitmq import rabbitmq_connection, rabbitmq_consumer
from modules.auth.consumer import auth0_webhook_received_consumer


async def shutdown(signal_type):
    """Graceful shutdown handler for the consumer worker."""
    logger.info(f"Received exit signal {signal_type}...")
    tasks = [t for t in asyncio.all_tasks() if t is not asyncio.current_task()]

    logger.info(f"Cancelling {len(tasks)} outstanding tasks")
    for task in tasks:
        task.cancel()

    await asyncio.gather(*tasks, return_exceptions=True)
    await rabbitmq_connection.close()
    logger.info("Consumer worker shutdown complete.")


async def main():
    """Main function for the consumer worker."""
    logger.info("Starting RabbitMQ Consumer Worker")

    # Setup signal handlers for graceful shutdown
    loop = asyncio.get_running_loop()
    for sig in (signal.SIGTERM, signal.SIGINT):
        loop.add_signal_handler(sig, lambda s=sig: asyncio.create_task(shutdown(s)))

    try:
        # Connect to RabbitMQ
        await rabbitmq_connection.connect()
        logger.info("Connected to RabbitMQ")

        # Register event handlers
        rabbitmq_consumer.register_handler(
            "auth0.webhook.received", auth0_webhook_received_consumer
        )

        logger.info("All event handlers registered.")

        # Start consuming messages
        await rabbitmq_consumer.start_consuming()
        logger.info("Consumer worker started, waiting for messages...")

        # Keep the worker running indefinitely
        await asyncio.Event().wait()

    except Exception as error:
        logger.error(f"Consumer worker encountered a fatal error: {str(error)}")
        sys.exit(1)


if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        logger.info("Consumer worker interrupted by user.")
    except Exception as error:
        logger.error(f"Consumer worker failed to start: {str(error)}")
        sys.exit(1)

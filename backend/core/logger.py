"""
Logger for the application.

This module configures a Loguru logger for structured, colorized logging.
"""

import sys
from typing import Any, Dict

from loguru import logger as loguru_logger


class AppLogger:
    """A logger that provides a consistent interface for logging."""

    def __init__(self, name: str = "app"):
        loguru_logger.remove()
        loguru_logger.add(
            sys.stderr,
            format="<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>:<cyan>{function}</cyan>:<cyan>{line}</cyan> - <level>{message}</level> | {extra}",
            level="INFO",
            colorize=True,
            serialize=False,  # Set to True for JSON output in production
        )
        self.logger = loguru_logger.bind()

    def info(self, message: str, extra: Dict[str, Any] | None = None) -> None:
        """Logs an info-level message."""
        self._log("info", message, extra)

    def error(self, message: str, extra: Dict[str, Any] | None = None) -> None:
        """Logs an error-level message."""
        self._log("error", message, extra)

    def warning(self, message: str, extra: Dict[str, Any] | None = None) -> None:
        """Logs a warning-level message."""
        self._log("warning", message, extra)

    def debug(self, message: str, extra: Dict[str, Any] | None = None) -> None:
        """Logs a debug-level message."""
        self._log("debug", message, extra)

    def _log(self, level: str, message: str, extra: Dict[str, Any] | None) -> None:
        """Helper method to perform logging."""
        logger_method = getattr(self.logger, level)
        if extra:
            logger_method(message, **extra)
        else:
            logger_method(message)


# Global logger instance
logger = AppLogger()

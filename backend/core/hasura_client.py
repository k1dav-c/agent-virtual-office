"""
Hasura GraphQL Client

This module provides a client for interacting with the Hasura GraphQL API.
"""

import re
import time
from typing import Any, Dict, Tuple

from gql import Client
from gql.transport.aiohttp import AIOHTTPTransport

from .config import settings
from .context import AppContext


def extract_operation_info(query_string: str) -> Tuple[str, str]:
    """
    Extracts the operation type and name from a GraphQL query string.

    Args:
        query_string: The GraphQL query string.

    Returns:
        A tuple containing the operation type (e.g., "query", "mutation")
        and the operation name.
    """
    query_lower = query_string.lower()
    operation_type = "unknown"
    operation_name = ""

    if "query " in query_lower:
        operation_type = "query"
    elif "mutation " in query_lower:
        operation_type = "mutation"
    elif "subscription " in query_lower:
        operation_type = "subscription"

    # Attempt to extract the operation name
    # e.g., query OperationName { ... } or mutation OperationName($var: Type) { ... }
    patterns = [
        r"(query|mutation|subscription)\s+(\w+)",
    ]

    for pattern in patterns:
        match = re.search(pattern, query_string, re.IGNORECASE)
        if match:
            operation_name = match.group(2)
            break

    return operation_type, operation_name


def create_hasura_client() -> Client:
    """Creates and returns a new Hasura GraphQL client instance."""
    endpoint = (
        settings.hasura_endpoint
        if settings.hasura_endpoint.endswith("/v1/graphql")
        else f"{settings.hasura_endpoint}/v1/graphql"
    )

    transport = AIOHTTPTransport(
        url=endpoint,
        headers={"x-hasura-admin-secret": settings.hasura_admin_secret},
    )

    return Client(transport=transport)


class TimedGraphQLClient:
    """A GraphQL client wrapper that logs execution time."""

    async def execute(
        self,
        query,
        variable_values: Dict[str, Any] | None = None,
        operation_name: str | None = None,
        ctx: AppContext | None = None,
    ) -> Dict[str, Any]:
        """
        Executes a GraphQL query and logs the execution time.
        A new client and session are created for each execution to avoid connection issues.

        Args:
            query: The GraphQL query document.
            variable_values: A dictionary of variables for the query.
            operation_name: The name of the operation to execute.
            ctx: The application context for logging.

        Returns:
            The result of the GraphQL query.
        """
        start_time = time.time()
        client = create_hasura_client()

        try:
            result = await client.execute_async(
                query, variable_values=variable_values, operation_name=operation_name
            )
            execution_time_ms = (time.time() - start_time) * 1000

            if ctx:
                op_type, op_name = extract_operation_info(str(query))
                final_op_name = operation_name or op_name
                log_message = f"[GraphQL {op_type.upper()}] {final_op_name or ''} executed successfully"
                log_data = {
                    "execution_time_ms": round(execution_time_ms, 2),
                    "operation_type": op_type,
                    "operation_name": final_op_name,
                    "has_variables": variable_values is not None,
                }
                ctx.logger.info(log_message, extra=log_data)

            return result

        except Exception as error:
            execution_time_ms = (time.time() - start_time) * 1000

            if ctx:
                op_type, op_name = extract_operation_info(str(query))
                final_op_name = operation_name or op_name
                log_message = (
                    f"[GraphQL {op_type.upper()}] {final_op_name or ''} failed"
                )
                log_data = {
                    "execution_time_ms": round(execution_time_ms, 2),
                    "operation_type": op_type,
                    "operation_name": final_op_name,
                    "error": str(error),
                    "error_type": type(error).__name__,
                }
                ctx.logger.error(log_message, extra=log_data)

            raise error

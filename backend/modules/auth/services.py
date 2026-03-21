"""
Auth Module - Business Services
"""

import zoneinfo
from datetime import datetime
from typing import Any, Dict, List

from core.context import AppContext
from core.dependencies import get_hasura_client
from gql import gql

from .schemas import Auth0UserProfile


class AuthService:
    """Auth0 Authentication Services"""

    @staticmethod
    async def upsert_user(
        user_data: Auth0UserProfile, ctx: AppContext
    ) -> Dict[str, Any]:
        """
        Creates or updates a user in the database using an 'upsert' operation.

        Args:
            user_data: The user profile data from Auth0.
            ctx: The application context for logging.

        Returns:
            A dictionary containing the user_id and a flag indicating if it's a new user.
        """
        mutation = gql(
            """
            mutation UpsertUser($user_data: users_insert_input!) {
                insert_users_one(
                    object: $user_data
                    on_conflict: {
                        constraint: users_pkey
                        update_columns: [
                            email, name, nickname, picture, email_verified,
                            given_name, family_name, last_login, timezone, locale
                        ]
                    }
                ) {
                    id
                    created_at
                    updated_at
                }
            }
        """
        )

        # Use Taiwan timezone
        taiwan_tz = zoneinfo.ZoneInfo("Asia/Taipei")
        current_time = datetime.now(taiwan_tz).isoformat()

        try:
            hasura_client = get_hasura_client()

            variables = {
                "user_data": {
                    "id": user_data.user_id,
                    "email": user_data.email,
                    "name": user_data.name,
                    "nickname": user_data.nickname,
                    "picture": user_data.picture,
                    "email_verified": user_data.email_verified or False,
                    "given_name": user_data.given_name,
                    "last_login": current_time,
                    "is_active": True,
                    "timezone": "Asia/Taipei",
                    "locale": "zh-TW",
                }
            }

            result = await hasura_client.execute(
                mutation, variable_values=variables, ctx=ctx
            )
            user = result.get("insert_users_one")

            if not user:
                raise ValueError("User upsert failed")

            return {
                "user_id": user["id"],
                "is_new_user": user["created_at"] == user["updated_at"],
            }

        except Exception as error:
            ctx.logger.error(
                "User upsert failed",
                extra={"error": str(error), "user_id": user_data.user_id},
            )
            raise

    @staticmethod
    async def get_user_device_ids(user_id: str, ctx: AppContext) -> List[str]:
        """
        Retrieves all device IDs associated with a user.

        Args:
            user_id: The ID of the user.
            ctx: The application context for logging.

        Returns:
            A list of device IDs.
        """
        return []

    @staticmethod
    async def is_user_admin(user_id: str, ctx: AppContext) -> bool:
        """
        Checks if a user has admin privileges.

        Args:
            user_id: The ID of the user.
            ctx: The application context for logging.

        Returns:
            True if the user is an admin, False otherwise.
        """
        query = gql(
            """
            query GetUserAdminStatus($user_id: String!) {
                users_by_pk(id: $user_id) {
                    is_admin
                }
            }
        """
        )

        try:
            hasura_client = get_hasura_client()

            variables = {"user_id": user_id}
            result = await hasura_client.execute(
                query, variable_values=variables, ctx=ctx
            )
            user = result.get("users_by_pk")
            return bool(user and user.get("is_admin"))

        except Exception as error:
            ctx.logger.error(
                "Failed to check admin status",
                extra={"error": str(error), "user_id": user_id},
            )
            raise

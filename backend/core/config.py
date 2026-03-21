"""
Application configuration.
"""

import os

from dotenv import load_dotenv
from pydantic import BaseModel

# Load environment variables from a .env file
load_dotenv()


class Settings(BaseModel):
    """
    Application settings, loaded from environment variables.
    """

    app_name: str = "FastAPI Auth0 Template"

    # Auth0 Configuration
    auth0_domain: str = os.environ["VITE_AUTH0_DOMAIN"]
    auth0_client_id: str = os.environ["VITE_AUTH0_CLIENT_ID"]

    # Hasura Configuration
    hasura_endpoint: str = os.environ["HASURA_ENDPOINT"]
    hasura_admin_secret: str = os.environ["SERVICE_PASSWORD_HASURA_ADMIN"]

    # RabbitMQ Configuration
    rabbitmq_host: str = os.environ["RABBITMQ_HOST"]
    rabbitmq_port: int = int(os.environ["RABBITMQ_PORT"])
    rabbitmq_user: str = os.environ["SERVICE_USER_RABBITMQ"]
    rabbitmq_password: str = os.environ["SERVICE_PASSWORD_RABBITMQ"]
    rabbitmq_vhost: str = os.environ["RABBITMQ_VHOST"]


# This single instance will be used across the application
# Pydantic will validate the types of the environment variables
settings = Settings()

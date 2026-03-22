FROM python:3.11-slim
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

WORKDIR /app

# Install curl for health checks and dependencies for Hasura CLI
RUN apt-get update && apt-get install -y --no-install-recommends curl ca-certificates gzip tar git && rm -rf /var/lib/apt/lists/*

# Install Hasura CLI
RUN curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash

# Copy requirements and install Python dependencies
COPY backend/requirements.txt .
RUN uv pip install --system --no-cache-dir -r requirements.txt

# Copy backend source to /app and Hasura project to /hasura
COPY backend/ /app/
COPY hasura/ /hasura/

# Ensure entrypoint is executable
COPY backend/entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Set Python path so application modules are importable
ENV PYTHONPATH=/app

# Expose port
EXPOSE 8000

# Use entrypoint script to run migrations then start
ENTRYPOINT ["/entrypoint.sh"]
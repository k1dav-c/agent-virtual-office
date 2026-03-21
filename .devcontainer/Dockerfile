FROM harbor.apmic.ai/proxy/py311node22:latest

# Set up workspace permissions
RUN mkdir -p /etc/caddy

RUN PROJECT_PATH=$(find /workspaces -maxdepth 1 -type d | grep -v "^/workspaces$" | grep -v "coder" | head -n 1) && \
    cp "${PROJECT_PATH}"/.devcontainer/Caddyfile /etc/caddy/Caddyfile

RUN curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash

# Install backend requirements
COPY backend/requirements.txt /tmp/pip-tmp/
RUN pip3 install --no-cache-dir -r /tmp/pip-tmp/requirements.txt \
    && rm -rf /tmp/pip-tmp

#!/usr/bin/env bash
set -euo pipefail

# Wait for Hasura to be up
HASURA_ENDPOINT=${HASURA_ENDPOINT:-http://hasura:8080/v1/graphql}
HASURA_ADMIN_SECRET=${HASURA_ADMIN_SECRET:-${SERVICE_PASSWORD_HASURA_ADMIN:-}}

echo "Waiting for Hasura (probing possible health endpoints based on ${HASURA_ENDPOINT})..."
HASURA_HEALTH_URL=""
for i in {1..30}; do
  # build candidate URLs to probe
  base_no_v1=${HASURA_ENDPOINT%/v1/graphql}
  candidates=("${HASURA_ENDPOINT}/health" "${HASURA_ENDPOINT}/healthz" "${base_no_v1}/health" "${base_no_v1}/healthz")

  for url in "${candidates[@]}"; do
    if curl --silent --fail --max-time 2 "$url" > /dev/null 2>&1; then
      HASURA_HEALTH_URL="$url"
      break 2
    fi
  done

  echo "Waiting for Hasura... (attempt ${i})"
  sleep 1
done

if [ -z "${HASURA_HEALTH_URL}" ]; then
  echo "Warning: could not reach Hasura health endpoint after retries. Proceeding but migrations may fail."
else
  echo "Hasura is ready at ${HASURA_HEALTH_URL}"
fi

# Apply migrations if hasura CLI exists and migrations folder is present
if command -v hasura >/dev/null 2>&1 && [ -d "/hasura/migrations" ]; then
  echo "Applying Hasura migrations..."

  # Determine a CLI endpoint suitable for hasura commands.
  # Prefer the discovered health URL (strip /health or /healthz),
  # otherwise derive from HASURA_ENDPOINT by removing /v1/graphql if present.
  if [ -n "${HASURA_HEALTH_URL}" ]; then
    cli_base=${HASURA_HEALTH_URL%/health}
    cli_base=${cli_base%/healthz}
  else
    cli_base=${HASURA_ENDPOINT%/v1/graphql}
  fi
  # remove any trailing slash
  HASURA_CLI_ENDPOINT=${cli_base%/}

  echo "Using Hasura CLI endpoint: ${HASURA_CLI_ENDPOINT}"

  # If we have a hasura project directory, pass it explicitly to the CLI to locate config.yaml
  PROJECT_FLAG=""
  if [ -d "/hasura" ]; then
    PROJECT_FLAG=(--project /hasura)
  fi

  if [ -n "${HASURA_ADMIN_SECRET}" ]; then
    hasura migrate apply --endpoint "${HASURA_CLI_ENDPOINT}" "${PROJECT_FLAG[@]}" --admin-secret "${HASURA_ADMIN_SECRET}" --all-databases || true
    hasura metadata apply --endpoint "${HASURA_CLI_ENDPOINT}" "${PROJECT_FLAG[@]}" --admin-secret "${HASURA_ADMIN_SECRET}" || true
  else
    hasura migrate apply --endpoint "${HASURA_CLI_ENDPOINT}" "${PROJECT_FLAG[@]}" --all-databases || true
    hasura metadata apply --endpoint "${HASURA_CLI_ENDPOINT}" "${PROJECT_FLAG[@]}" || true
  fi
else
  echo "Hasura CLI not found or migrations directory missing; skipping migrations"
fi

echo "Starting application"
# Start uvicorn using main:app since backend was copied to /app
exec uvicorn main:app --host 0.0.0.0 --port 8000

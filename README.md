# Agent Virtual Office

> A pixel-art virtual office where you can watch your AI agents work in real-time.

Connect your Claude Code sessions via MCP and see animated pixel characters appear at their desks — each one reporting live status, role, and current task as agents work through your projects.

## Features

- **Live pixel-art office** — a top-down office scene rendered with SVG sprites and CSS animations
- **Real-time agent status** — updates instantly via GraphQL WebSocket subscriptions, no polling
- **Automatic role inference** — analyses each summary with weighted keyword scoring to assign roles (Frontend Developer, DevOps Engineer, Debugger, Architect, etc.)
- **11 agent roles** — each with its own colour, emoji badge, and desk accessory
- **Four status states** — `working` (green), `idle` (blue), `complete` (grey), `failure` (red)
- **Stale-session filtering** — sessions without heartbeat for 12 hours are auto-hidden
- **Session grouping & nicknames** — rename any session directly in the sidebar
- **Workspace deep-links** — clickable links to open Coder workspaces
- **Completion sound** — optional chime when any agent transitions to `complete`
- **API key management** — keys generated with Web Crypto API, only SHA-256 hash stored
- **Auth0 authentication** — every page protected; user records synced on first login
- **Append-only activity log** — every status call recorded in `session_logs`

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, TypeScript 5, Vite 7, Tailwind CSS 4 |
| Auth (client) | Auth0 React SDK 2 |
| GraphQL (client) | graphql-request 7, graphql-ws 6 |
| Backend API | FastAPI 0.118, Python 3.11 |
| MCP Server | `mcp` Python SDK (Streamable HTTP transport) |
| GraphQL Engine | Hasura GraphQL Engine v2.36 |
| Database | PostgreSQL 17 |
| Message Queue | RabbitMQ 4 (aio-pika 9) |
| Containerisation | Docker, Docker Compose |

## Quick Start

### 1. Clone and configure

```bash
git clone https://github.com/k1dav-c/agent-virtual-office.git
cd agent-virtual-office
cp .env.docker .env
# Edit .env with your Auth0 domain/client ID and passwords
```

### 2. Start all services

```bash
docker compose up --build
```

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API + MCP | http://localhost:8000 |
| Hasura Console | http://localhost:8080 |
| RabbitMQ Management | http://localhost:15672 |

### 3. Apply Hasura migrations

```bash
hasura migrate apply --database-name default
hasura metadata apply
```

### 4. Generate an API key

1. Open http://localhost:3000 and sign in with Auth0
2. Go to **Dashboard → API Keys** and create a key (shown only once)

## Architecture

```
┌───────────────────────────────────────────────────────┐
│  Browser (React 19 + Auth0)                           │
│  /office  /dashboard  /admin                          │
│     │           │                                     │
│     │  GraphQL WebSocket subscription                 │
└─────┴───────────┬─────────────────────────────────────┘
                  ▼
┌─────────────────────────────────────────────────────┐
│  Hasura GraphQL Engine (port 8080)                  │
│  JWT validation · Row-level permissions              │
│  Real-time subscriptions                             │
└──────────────────┬──────────────────────────────────┘
                   ▼
┌──────────────────────────────────────────────────────┐
│  PostgreSQL 17                                       │
│  users · api_keys · agent_sessions · session_logs    │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  FastAPI Backend (port 8000)                         │
│  /health · /api/auth · /mcp/*                        │
│                                                      │
│  MCP Streamable HTTP ─► report_status()              │
│    → role_inference → upsert session → audit log     │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  Claude Code / MCP Client                            │
│  POST /mcp/mcp  (Bearer API key)                     │
│  Tool: report_status(summary, state, session_id)     │
└──────────────────────────────────────────────────────┘
```

## MCP Integration

### Add to Claude Code

In `.claude/settings.json`:

```json
{
  "mcpServers": {
    "virtual-office": {
      "type": "streamable-http",
      "url": "https://YOUR_HOST/mcp/mcp?api_key=avo_<YOUR_API_KEY>"
    }
  }
}
```

### Tell the agent to report status

Add to your `CLAUDE.md`:

```
Use the virtual-office MCP tool `report_status` to report your working status.
- Report a summary of what you're doing, your state (working/complete/idle/failure),
  and optionally a link and workspace name.
- Always include a `session_id` — generate a random UUID once and reuse it.
- Report status after receiving each new user message.
- Report "complete" when you finish a task.
```

### How it works

1. Claude Code calls `report_status` via MCP Streamable HTTP
2. Backend authenticates via SHA-256 API key hash lookup
3. Role is inferred from summary text (weighted keyword scoring)
4. Session is upserted in PostgreSQL via Hasura GraphQL
5. Hasura pushes real-time update to all connected browsers
6. Pixel character animates to reflect the new state

## License

MIT License — see [LICENSE](LICENSE) for details.
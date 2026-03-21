"""
MCP Server — mounted into FastAPI as an ASGI sub-app (v2 SDK).

Provides the `report_status` tool for Claude Code sessions.
"""

import uuid

from core.hasura_client import TimedGraphQLClient
from gql import gql
from mcp.server.mcpserver import MCPServer

from .auth import get_current_auth
from .role_inference import infer_role

mcp = MCPServer("agent-virtual-office")
_client = TimedGraphQLClient()

UPSERT_SESSION = gql(
    """
    mutation UpsertAgentSession(
        $api_key_id: uuid!,
        $user_id: String!,
        $session_id: String!,
        $role: String!,
        $status: String!,
        $summary: String,
        $link: String,
        $workspace: String
    ) {
        insert_agent_sessions_one(
            object: {
                api_key_id: $api_key_id,
                user_id: $user_id,
                session_id: $session_id,
                role: $role,
                status: $status,
                summary: $summary,
                link: $link,
                workspace: $workspace,
                last_heartbeat_at: "now()"
            }
            on_conflict: {
                constraint: agent_sessions_api_key_id_session_id_role_key,
                update_columns: [status, summary, link, workspace, last_heartbeat_at]
            }
        ) {
            id
        }
    }
"""
)

GET_SESSION = gql(
    """
    query GetSession($api_key_id: uuid!, $session_id: String!, $role: String!) {
        agent_sessions(
            where: {
                api_key_id: { _eq: $api_key_id },
                session_id: { _eq: $session_id },
                role: { _eq: $role }
            }
            limit: 1
        ) {
            id
        }
    }
"""
)

INSERT_LOG = gql(
    """
    mutation InsertSessionLog(
        $session_id: uuid!,
        $summary: String,
        $state: String!,
        $link: String
    ) {
        insert_session_logs_one(
            object: {
                session_id: $session_id,
                summary: $summary,
                state: $state,
                link: $link
            }
        ) {
            id
        }
    }
"""
)


@mcp.tool()
async def report_status(
    summary: str,
    state: str,
    link: str = "",
    workspace: str = "",
    session_id: str = "",
) -> str:
    """
    Report your current working status to the Virtual Office.

    This updates your agent's status in the office dashboard so the team
    can see what you're working on in real-time.

    Authentication is handled automatically via the Authorization header
    when connecting to the MCP server — no api_key parameter needed.

    Args:
        summary: A concise description of what you're currently doing (max 160 chars).
        state: Your current state - one of: working, complete, idle, failure.
        link: Optional URL to a relevant resource (PR, issue, etc).
        workspace: Optional Coder workspace identifier (e.g. owner/workspace-name).
        session_id: A unique identifier for this Claude Code session. Use a random UUID
                    generated once at the start of your session to distinguish multiple
                    concurrent sessions using the same API key.
    """
    valid_states = {"working", "complete", "idle", "failure"}
    if state not in valid_states:
        return f"Error: state must be one of {valid_states}"

    try:
        auth_result = get_current_auth()
    except ValueError as e:
        return f"Error: {e}"

    # Use client-provided session_id, or fall back to deterministic one from API key
    if not session_id:
        session_id = str(uuid.uuid5(uuid.NAMESPACE_URL, auth_result.api_key_id))

    role = infer_role(summary)

    # Upsert agent session
    try:
        await _client.execute(
            UPSERT_SESSION,
            variable_values={
                "api_key_id": auth_result.api_key_id,
                "user_id": auth_result.user_id,
                "session_id": session_id,
                "role": role,
                "status": state,
                "summary": summary[:160] if summary else None,
                "link": link or None,
                "workspace": workspace or None,
            },
        )
    except Exception as e:
        return f"Error updating session: {e}"

    # Insert log entry
    try:
        session_data = await _client.execute(
            GET_SESSION,
            variable_values={
                "api_key_id": auth_result.api_key_id,
                "session_id": session_id,
                "role": role,
            },
        )
        sessions = session_data.get("agent_sessions", [])
        if sessions:
            await _client.execute(
                INSERT_LOG,
                variable_values={
                    "session_id": sessions[0]["id"],
                    "summary": summary[:160] if summary else None,
                    "state": state,
                    "link": link or None,
                },
            )
    except Exception:
        pass  # Log insertion failure is non-critical

    return f"Status reported: [{role}] {state} - {summary[:80]}"

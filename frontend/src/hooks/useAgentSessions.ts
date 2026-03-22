import { useAuth0 } from "@auth0/auth0-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { createWebSocketClient } from "@lib/graphql-ws-client";
import type { AgentSession } from "../types/agent";

const AGENT_SESSIONS_SUBSCRIPTION = `
  subscription ActiveAgentSessions {
    agent_sessions(
      order_by: { started_at: asc }
    ) {
      id
      session_id
      role
      status
      summary
      link
      workspace
      started_at
      last_heartbeat_at
    }
  }
`;

const STALE_THRESHOLD_MS = 12 * 60 * 60 * 1000; // 12 hours

export function useAgentSessions() {
  const { getIdTokenClaims } = useAuth0();
  const [sessions, setSessions] = useState<AgentSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const unsubRef = useRef<(() => void) | null>(null);

  const filterActive = useCallback((allSessions: AgentSession[]) => {
    const now = Date.now();
    return allSessions.filter((s) => {
      const started = new Date(s.started_at).getTime();
      const heartbeat = new Date(s.last_heartbeat_at).getTime();
      return (
        now - started < STALE_THRESHOLD_MS &&
        now - heartbeat < STALE_THRESHOLD_MS
      );
    });
  }, []);

  useEffect(() => {
    const client = createWebSocketClient(getIdTokenClaims);

    unsubRef.current = client.subscribe(
      { query: AGENT_SESSIONS_SUBSCRIPTION },
      {
        next: (result: any) => {
          if (result.data?.agent_sessions) {
            setSessions(filterActive(result.data.agent_sessions));
            setLoading(false);
          }
        },
        error: (err: Error) => {
          console.error("Agent sessions subscription error:", err);
          setError(err);
          setLoading(false);
        },
        complete: () => {
          setLoading(false);
        },
      },
    );

    return () => {
      if (unsubRef.current) {
        unsubRef.current();
      }
    };
  }, [getIdTokenClaims, filterActive]);

  // Re-filter periodically to remove stale sessions
  useEffect(() => {
    const interval = setInterval(() => {
      setSessions((prev) => filterActive(prev));
    }, 30_000);
    return () => clearInterval(interval);
  }, [filterActive]);

  return { sessions, loading, error };
}

-- Agent Sessions: 追蹤每個 Claude Code session 的即時狀態
CREATE TABLE public.agent_sessions (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           varchar NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  api_key_id        uuid NOT NULL REFERENCES public.api_keys(id) ON DELETE CASCADE,
  session_id        varchar NOT NULL,
  role              varchar NOT NULL DEFAULT 'Developer',
  status            varchar NOT NULL DEFAULT 'idle'
                    CHECK (status IN ('working', 'complete', 'idle', 'failure')),
  summary           text,
  link              text,
  started_at        timestamptz NOT NULL DEFAULT now(),
  last_heartbeat_at timestamptz NOT NULL DEFAULT now(),
  metadata          jsonb DEFAULT '{}'::jsonb,

  UNIQUE (api_key_id, session_id)
);

CREATE INDEX idx_agent_sessions_user_id ON public.agent_sessions(user_id);
CREATE INDEX idx_agent_sessions_status ON public.agent_sessions(status);
CREATE INDEX idx_agent_sessions_last_heartbeat ON public.agent_sessions(last_heartbeat_at);

COMMENT ON TABLE public.agent_sessions IS 'Active and recent Claude Code agent sessions';
COMMENT ON COLUMN public.agent_sessions.session_id IS 'Unique identifier from Claude Code MCP connection';
COMMENT ON COLUMN public.agent_sessions.role IS 'Inferred role based on task summary keywords';

-- Session Logs: 所有 agent 狀態更新的 append-only 記錄
CREATE TABLE public.session_logs (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id  uuid NOT NULL REFERENCES public.agent_sessions(id) ON DELETE CASCADE,
  summary     text,
  state       varchar NOT NULL CHECK (state IN ('working', 'complete', 'idle', 'failure')),
  link        text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_session_logs_session_id ON public.session_logs(session_id);
CREATE INDEX idx_session_logs_created_at ON public.session_logs(created_at);

COMMENT ON TABLE public.session_logs IS 'Append-only log of all agent status updates';

ALTER TABLE public.agent_sessions
  ADD COLUMN workspace varchar;

COMMENT ON COLUMN public.agent_sessions.workspace
  IS 'Coder workspace identifier, e.g. owner/workspace-name';

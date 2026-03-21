-- Change unique constraint from (api_key_id, session_id) to (api_key_id, session_id, role)
-- This allows the same session to have multiple roles as separate agents.
ALTER TABLE public.agent_sessions
  DROP CONSTRAINT agent_sessions_api_key_id_session_id_key;

ALTER TABLE public.agent_sessions
  ADD CONSTRAINT agent_sessions_api_key_id_session_id_role_key
  UNIQUE (api_key_id, session_id, role);

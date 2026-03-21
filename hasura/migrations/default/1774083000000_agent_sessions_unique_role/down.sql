-- Revert: restore original unique constraint
ALTER TABLE public.agent_sessions
  DROP CONSTRAINT agent_sessions_api_key_id_session_id_role_key;

ALTER TABLE public.agent_sessions
  ADD CONSTRAINT agent_sessions_api_key_id_session_id_key
  UNIQUE (api_key_id, session_id);

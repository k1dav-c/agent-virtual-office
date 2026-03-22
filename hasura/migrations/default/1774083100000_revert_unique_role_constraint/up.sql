-- Revert unique constraint to (api_key_id, session_id) so each session
-- has exactly one agent row. Previously the constraint included role,
-- which caused duplicate rows when the inferred role changed.

-- First, delete duplicate rows keeping only the most recently updated one
-- per (api_key_id, session_id).
DELETE FROM public.agent_sessions a
  USING public.agent_sessions b
  WHERE a.api_key_id = b.api_key_id
    AND a.session_id = b.session_id
    AND a.last_heartbeat_at < b.last_heartbeat_at;

ALTER TABLE public.agent_sessions
  DROP CONSTRAINT agent_sessions_api_key_id_session_id_role_key;

ALTER TABLE public.agent_sessions
  ADD CONSTRAINT agent_sessions_api_key_id_session_id_key
  UNIQUE (api_key_id, session_id);

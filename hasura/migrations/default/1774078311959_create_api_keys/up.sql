-- API Keys: 用於 MCP Server 認證
CREATE TABLE public.api_keys (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id       varchar NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  key_hash      varchar NOT NULL UNIQUE,
  key_prefix    varchar(16) NOT NULL,
  name          varchar NOT NULL DEFAULT 'Default',
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_used_at  timestamptz,
  is_active     boolean NOT NULL DEFAULT true
);

CREATE INDEX idx_api_keys_user_id ON public.api_keys(user_id);
CREATE INDEX idx_api_keys_key_hash ON public.api_keys(key_hash);

COMMENT ON TABLE public.api_keys IS 'API keys for MCP server authentication';
COMMENT ON COLUMN public.api_keys.key_hash IS 'SHA-256 hash of the raw API key';
COMMENT ON COLUMN public.api_keys.key_prefix IS 'Visible prefix like avo_xxxx for UI display';

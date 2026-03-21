CREATE TABLE public.users (
  id              varchar PRIMARY KEY NOT NULL,  -- Auth0 user_id
  email           varchar NOT NULL,
  email_verified  bool NOT NULL DEFAULT false,
  name            varchar,
  given_name      varchar,
  family_name     varchar,
  nickname        varchar,
  picture         text,
  identities      jsonb,   -- Auth0 identities array
  created_at      timestamptz,
  updated_at      timestamptz,
  last_login      timestamptz,

  -- 系統自訂補充欄位
  date_joined     timestamptz NOT NULL DEFAULT now(),
  is_active       bool NOT NULL DEFAULT false,
  timezone        varchar NOT NULL DEFAULT 'Asia/Taipei',
  locale          varchar DEFAULT 'zh-TW'
);

-- 表格註解
COMMENT ON TABLE public.users IS '使用者資料表（以 Auth0 為主要來源）';

-- 欄位註解
COMMENT ON COLUMN public.users.id IS 'Auth0 user_id (唯一識別)';
COMMENT ON COLUMN public.users.email IS '信箱';
COMMENT ON COLUMN public.users.email_verified IS 'Email 是否已驗證';
COMMENT ON COLUMN public.users.name IS '使用者全名';
COMMENT ON COLUMN public.users.given_name IS '名';
COMMENT ON COLUMN public.users.family_name IS '姓';
COMMENT ON COLUMN public.users.nickname IS '暱稱';
COMMENT ON COLUMN public.users.picture IS '頭像 URL';
COMMENT ON COLUMN public.users.identities IS '聯盟提供者 identities JSON資料';
COMMENT ON COLUMN public.users.created_at IS 'Auth0 建立帳號時間';
COMMENT ON COLUMN public.users.updated_at IS 'Auth0 更新時間';
COMMENT ON COLUMN public.users.last_login IS '最後登入時間';
COMMENT ON COLUMN public.users.date_joined IS '本地系統紀錄：加入時間';
COMMENT ON COLUMN public.users.is_active IS '是否啟用';
COMMENT ON COLUMN public.users.timezone IS '時區';
COMMENT ON COLUMN public.users.locale IS '語系';

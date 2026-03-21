comment on column "public"."users"."identities" is E'使用者資料表（以 Auth0 為主要來源）';
alter table "public"."users" alter column "identities" drop not null;
alter table "public"."users" add column "identities" jsonb;

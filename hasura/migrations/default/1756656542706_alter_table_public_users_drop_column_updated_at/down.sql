comment on column "public"."users"."updated_at" is E'使用者資料表（以 Auth0 為主要來源）';
alter table "public"."users" alter column "updated_at" set default now();
alter table "public"."users" alter column "updated_at" drop not null;
alter table "public"."users" add column "updated_at" timestamptz;

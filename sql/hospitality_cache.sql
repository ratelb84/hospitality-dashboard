-- Server-side cache table for Hospitality Dashboard
-- Run in Supabase SQL editor (service role) or via Management API.

create table if not exists public.hospitality_cache (
  cache_key text not null,
  venue_id bigint not null,
  range_start date not null,
  range_end date not null,
  fetched_at timestamptz not null default now(),
  payload jsonb not null,
  inserted_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint hospitality_cache_pkey primary key (cache_key, venue_id)
);

-- Optional: keep updated_at fresh
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_hospitality_cache_updated_at on public.hospitality_cache;
create trigger trg_hospitality_cache_updated_at
before update on public.hospitality_cache
for each row execute procedure public.set_updated_at();

-- RLS: ON (recommended). We don't have Supabase Auth in the front-end, so
-- cache access is via the serverless function with service role.
alter table public.hospitality_cache enable row level security;

-- Deny all from anon/authenticated; serverless uses service role and bypasses RLS.
revoke all on table public.hospitality_cache from anon;
revoke all on table public.hospitality_cache from authenticated;

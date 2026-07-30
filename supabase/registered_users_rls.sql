-- ChatEarn registered_users setup
-- Run this once in Supabase Dashboard > SQL Editor.

-- Ensure the expected columns exist.
alter table public.registered_users
  add column if not exists user_id uuid,
  add column if not exists full_name text,
  add column if not exists email text,
  add column if not exists registered_at timestamptz;

-- Make future inserts safe even when registered_at is omitted.
alter table public.registered_users
  alter column registered_at set default now();

-- Fill any existing null timestamps before keeping the NOT NULL rule.
update public.registered_users
set registered_at = now()
where registered_at is null;

alter table public.registered_users
  alter column registered_at set not null;

-- Required for safe UPSERT operations.
create unique index if not exists registered_users_user_id_uidx
  on public.registered_users (user_id);

-- Automatically create or repair the registered_users row whenever
-- a Supabase Auth user is created or their basic details are updated.
create or replace function public.sync_registered_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.registered_users (user_id, full_name, email, registered_at)
  values (
    new.id,
    coalesce(nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''), split_part(coalesce(new.email, ''), '@', 1), 'User'),
    new.email,
    coalesce(new.created_at, now())
  )
  on conflict (user_id) do update
  set full_name = excluded.full_name,
      email = excluded.email;

  return new;
end;
$$;

-- Recreate the Auth trigger safely.
drop trigger if exists sync_registered_user_after_auth_change on auth.users;
create trigger sync_registered_user_after_auth_change
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.sync_registered_user();

-- Backfill users who already exist in Supabase Auth but are missing here.
insert into public.registered_users (user_id, full_name, email, registered_at)
select
  u.id,
  coalesce(nullif(trim(u.raw_user_meta_data ->> 'full_name'), ''), split_part(coalesce(u.email, ''), '@', 1), 'User'),
  u.email,
  coalesce(u.created_at, now())
from auth.users u
on conflict (user_id) do update
set full_name = excluded.full_name,
    email = excluded.email;

-- Secure the table so signed-in users can only access their own row.
alter table public.registered_users enable row level security;

drop policy if exists "Users can read own registration" on public.registered_users;
create policy "Users can read own registration"
on public.registered_users
for select
to authenticated
using (auth.uid() = user_id);

drop policy if exists "Users can insert own registration" on public.registered_users;
create policy "Users can insert own registration"
on public.registered_users
for insert
to authenticated
with check (auth.uid() = user_id);

drop policy if exists "Users can update own registration" on public.registered_users;
create policy "Users can update own registration"
on public.registered_users
for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

grant select, insert, update on public.registered_users to authenticated;

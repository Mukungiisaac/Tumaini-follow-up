create table if not exists public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text not null unique,
  display_name text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create policy "Admins can read their own profile"
  on public.admin_users
  for select
  to authenticated
  using (user_id = (select auth.uid()));

create table if not exists public.app_records (
  record_type text not null check (record_type in ('children', 'houses', 'sessions', 'activities')),
  id text not null,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  updated_by uuid not null default auth.uid() references auth.users (id),
  primary key (record_type, id)
);

create index if not exists app_records_type_updated_at_idx
  on public.app_records (record_type, updated_at desc);

alter table public.app_records enable row level security;

create policy "Active admins can read app records"
  on public.app_records
  for select
  to authenticated
  using (
    exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
        and active
    )
  );

create policy "Active admins can insert app records"
  on public.app_records
  for insert
  to authenticated
  with check (
    exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
        and active
    )
  );

create policy "Active admins can update app records"
  on public.app_records
  for update
  to authenticated
  using (
    exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
        and active
    )
  )
  with check (
    exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
        and active
    )
  );

create policy "Active admins can delete app records"
  on public.app_records
  for delete
  to authenticated
  using (
    exists (
      select 1
      from public.admin_users
      where user_id = (select auth.uid())
        and active
    )
  );

grant select on public.admin_users to authenticated;
grant select, insert, update, delete on public.app_records to authenticated;
begin;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'child-images',
  'child-images',
  false,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']::text[]
)
on conflict (id) do update
set name = excluded.name,
    public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Active admins can read child images" on storage.objects;
create policy "Active admins can read child images"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'child-images'
    and exists (
      select 1 from public.admin_users
      where user_id = (select auth.uid()) and active
    )
  );

drop policy if exists "Active admins can upload child images" on storage.objects;
create policy "Active admins can upload child images"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'child-images'
    and exists (
      select 1 from public.admin_users
      where user_id = (select auth.uid()) and active
    )
  );

drop policy if exists "Active admins can update child images" on storage.objects;
create policy "Active admins can update child images"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'child-images'
    and exists (
      select 1 from public.admin_users
      where user_id = (select auth.uid()) and active
    )
  )
  with check (
    bucket_id = 'child-images'
    and exists (
      select 1 from public.admin_users
      where user_id = (select auth.uid()) and active
    )
  );

drop policy if exists "Active admins can delete child images" on storage.objects;
create policy "Active admins can delete child images"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'child-images'
    and exists (
      select 1 from public.admin_users
      where user_id = (select auth.uid()) and active
    )
  );

commit;

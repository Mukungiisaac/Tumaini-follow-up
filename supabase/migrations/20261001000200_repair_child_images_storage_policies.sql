begin;

insert into storage.buckets (id, name, public)
values ('child-images', 'child-images', false)
on conflict (id) do update set public = false;

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
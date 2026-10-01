do $$
begin
  if not exists (
    select 1
    from pg_publication
    where pubname = 'supabase_realtime'
  ) then
    raise exception 'Supabase realtime publication is not available';
  end if;

  if not exists (
    select 1
    from pg_publication_tables
    where pubname = 'supabase_realtime'
      and schemaname = 'public'
      and tablename = 'app_records'
  ) then
    alter publication supabase_realtime add table public.app_records;
  end if;
end
$$;
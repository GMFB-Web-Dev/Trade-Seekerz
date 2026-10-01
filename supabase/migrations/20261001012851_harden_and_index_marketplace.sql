-- Follow-up from Supabase security and performance advisors.

revoke all on function public.rls_auto_enable() from public, anon, authenticated;

create or replace function public.complete_registration(
  account_type text,
  chosen_display_name text,
  chosen_city text default null,
  chosen_business_name text default null
)
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare current_user_id uuid := (select auth.uid());
begin
  if current_user_id is null then raise exception 'Authentication required'; end if;
  if account_type not in ('homeowner', 'tradesperson') then raise exception 'Invalid account type'; end if;
  if char_length(trim(chosen_display_name)) < 2 then raise exception 'Display name is required'; end if;

  update public.profiles
  set role = account_type,
      display_name = trim(chosen_display_name),
      city = nullif(trim(chosen_city), ''),
      onboarding_completed = true,
      updated_at = timezone('utc', now())
  where id = current_user_id and onboarding_completed = false and role <> 'admin';
  if not found then raise exception 'Registration is already complete'; end if;

  if account_type = 'tradesperson' then
    insert into public.tradesperson_profiles (user_id, business_name)
    values (current_user_id, coalesce(nullif(trim(chosen_business_name), ''), trim(chosen_display_name)))
    on conflict (user_id) do nothing;
  end if;
end;
$$;
revoke all on function public.complete_registration(text, text, text, text) from public, anon;
grant execute on function public.complete_registration(text, text, text, text) to authenticated;

create or replace function private.enforce_profile_update()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if not private.is_admin() then
    if not (
      old.onboarding_completed = false
      and new.onboarding_completed = true
      and old.role = 'homeowner'
      and new.role in ('homeowner', 'tradesperson')
    ) then
      new.role = old.role;
      new.onboarding_completed = old.onboarding_completed;
    end if;
    new.suspended_at = old.suspended_at;
    new.deleted_at = old.deleted_at;
  end if;
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create policy "tradespeople create own business profile" on public.tradesperson_profiles for insert
to authenticated with check (user_id = (select auth.uid()) and exists (
  select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'tradesperson'
));
grant insert on public.tradesperson_profiles to authenticated;

drop policy "users update own profile" on public.profiles;
drop policy "admins update profiles" on public.profiles;
create policy "owners and admins update profiles" on public.profiles for update
to authenticated using (id = (select auth.uid()) or private.is_admin())
with check (id = (select auth.uid()) or private.is_admin());

drop policy "tradespeople update own business" on public.tradesperson_profiles;
drop policy "admins update tradespeople" on public.tradesperson_profiles;
create policy "owners and admins update tradespeople" on public.tradesperson_profiles for update
to authenticated using (user_id = (select auth.uid()) or private.is_admin())
with check (user_id = (select auth.uid()) or private.is_admin());

drop policy "users view own contacts" on public.user_contacts;
drop policy "project counterparts view contacts" on public.user_contacts;
create policy "owners counterparts and admins view contacts" on public.user_contacts for select
to authenticated using (
  user_id = (select auth.uid())
  or private.is_admin()
  or exists (
    select 1 from public.applications a join public.projects p on p.id = a.project_id
    where a.status in ('new','shortlisted','accepted') and (
      (p.homeowner_id = user_contacts.user_id and a.tradesperson_id = (select auth.uid())) or
      (a.tradesperson_id = user_contacts.user_id and p.homeowner_id = (select auth.uid()))
    )
  )
);

create index if not exists conversations_homeowner_idx on public.conversations(homeowner_id);
create index if not exists conversations_tradesperson_idx on public.conversations(tradesperson_id);
create index if not exists feedback_user_idx on public.feedback(user_id);
create index if not exists messages_sender_idx on public.messages(sender_id);
create index if not exists project_media_owner_idx on public.project_media(owner_id);
create index if not exists projects_awarded_idx on public.projects(awarded_to);
create index if not exists projects_category_idx on public.projects(category_id);
create index if not exists projects_homeowner_idx on public.projects(homeowner_id);
create index if not exists reports_project_idx on public.reports(project_id);
create index if not exists reports_reported_user_idx on public.reports(reported_user_id);
create index if not exists reports_reporter_idx on public.reports(reporter_id);
create index if not exists reviews_homeowner_idx on public.reviews(homeowner_id);
create index if not exists reviews_tradesperson_idx on public.reviews(tradesperson_id);
create index if not exists token_ledger_project_idx on public.token_ledger(project_id);
create index if not exists tradespeople_category_idx on public.tradesperson_profiles(category_id);

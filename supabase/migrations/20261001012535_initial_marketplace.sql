-- Trade Seekerz marketplace schema
-- Roles are stored in public.profiles, never trusted from user-editable JWT metadata.

create extension if not exists pgcrypto;

create schema if not exists private;
revoke all on schema private from public;
grant usage on schema private to authenticated, service_role;

create or replace function private.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'homeowner' check (role in ('homeowner', 'tradesperson', 'admin')),
  display_name text not null default '',
  city text,
  avatar_path text,
  onboarding_completed boolean not null default false,
  suspended_at timestamptz,
  deleted_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.user_contacts (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  email text,
  phone text,
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null unique,
  image_path text,
  active boolean not null default true,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.tradesperson_profiles (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  business_name text not null default '',
  category_id uuid references public.categories(id) on delete set null,
  bio text not null default '',
  services text[] not null default '{}',
  insurance_providers text[] not null default '{}',
  memberships text[] not null default '{}',
  gallery_paths text[] not null default '{}',
  verified boolean not null default false,
  completed_jobs integer not null default 0 check (completed_jobs >= 0),
  rating numeric(2,1) not null default 0 check (rating between 0 and 5),
  review_count integer not null default 0 check (review_count >= 0),
  credits integer not null default 0 check (credits >= 0),
  stripe_customer_id text unique,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  homeowner_id uuid not null references public.profiles(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 120),
  city text not null,
  category_id uuid references public.categories(id) on delete set null,
  description text not null check (char_length(description) between 20 and 5000),
  budget_min integer check (budget_min is null or budget_min >= 0),
  budget_max integer check (budget_max is null or budget_max >= coalesce(budget_min, 0)),
  hire_likelihood text not null default 'ready' check (hire_likelihood in ('exploring', 'planning', 'ready', 'urgent')),
  project_stage text not null default 'planning' check (project_stage in ('planning', 'consent', 'ready', 'in_progress')),
  target_date date,
  keywords text[] not null default '{}',
  status text not null default 'open' check (status in ('draft', 'open', 'awarded', 'completed', 'cancelled')),
  awarded_to uuid references public.profiles(id) on delete set null,
  applicant_count integer not null default 0 check (applicant_count >= 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.project_media (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  owner_id uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null,
  media_type text not null default 'image' check (media_type in ('image', 'video')),
  created_at timestamptz not null default timezone('utc', now()),
  unique(project_id, storage_path)
);

create table public.applications (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  tradesperson_id uuid not null references public.profiles(id) on delete cascade,
  intro_message text not null check (char_length(intro_message) between 10 and 1000),
  status text not null default 'new' check (status in ('new', 'shortlisted', 'accepted', 'declined', 'withdrawn')),
  credits_spent integer not null default 1 check (credits_spent > 0),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now()),
  unique(project_id, tradesperson_id)
);

create table public.quotes (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null unique references public.applications(id) on delete cascade,
  amount integer not null check (amount > 0),
  summary text not null check (char_length(summary) between 10 and 3000),
  estimated_start date,
  status text not null default 'sent' check (status in ('draft', 'sent', 'accepted', 'declined', 'withdrawn')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.conversations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  homeowner_id uuid not null references public.profiles(id) on delete cascade,
  tradesperson_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default timezone('utc', now()),
  unique(project_id, homeowner_id, tradesperson_id)
);

create table public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references public.profiles(id) on delete cascade,
  body text not null check (char_length(body) between 1 and 4000),
  read_at timestamptz,
  created_at timestamptz not null default timezone('utc', now())
);

create table public.reviews (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  homeowner_id uuid not null references public.profiles(id) on delete cascade,
  tradesperson_id uuid not null references public.profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  body text not null check (char_length(body) between 10 and 2000),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid not null references public.profiles(id) on delete cascade,
  reported_user_id uuid references public.profiles(id) on delete set null,
  project_id uuid references public.projects(id) on delete set null,
  reason text not null,
  details text not null,
  status text not null default 'open' check (status in ('open', 'reviewing', 'resolved', 'dismissed')),
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete set null,
  email text,
  message text not null check (char_length(message) between 10 and 3000),
  created_at timestamptz not null default timezone('utc', now())
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.profiles(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  stripe_price_id text,
  plan_name text,
  status text not null default 'inactive',
  current_period_end timestamptz,
  cancel_at_period_end boolean not null default false,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table public.token_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  delta integer not null check (delta <> 0),
  reason text not null,
  project_id uuid references public.projects(id) on delete set null,
  stripe_event_id text unique,
  balance_after integer not null check (balance_after >= 0),
  created_at timestamptz not null default timezone('utc', now())
);

create table public.stripe_webhook_events (
  id text primary key,
  event_type text not null,
  status text not null default 'processing' check (status in ('processing', 'processed', 'failed')),
  error text,
  processed_at timestamptz,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create index projects_discovery_idx on public.projects(status, city, category_id, created_at desc);
create index applications_project_idx on public.applications(project_id, created_at desc);
create index applications_tradesperson_idx on public.applications(tradesperson_id, created_at desc);
create index messages_conversation_idx on public.messages(conversation_id, created_at);
create index token_ledger_user_idx on public.token_ledger(user_id, created_at desc);
create index reports_status_idx on public.reports(status, created_at desc);

create or replace function private.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles
    where id = (select auth.uid())
      and role = 'admin'
      and suspended_at is null
      and deleted_at is null
  );
$$;
revoke all on function private.is_admin() from public, anon;
grant execute on function private.is_admin() to authenticated, service_role;

create or replace function private.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', ''))
  on conflict (id) do nothing;
  insert into public.user_contacts (user_id, email)
  values (new.id, new.email)
  on conflict (user_id) do update set email = excluded.email;
  return new;
end;
$$;
revoke all on function private.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function private.handle_new_user();

create or replace function public.complete_registration(
  account_type text,
  chosen_display_name text,
  chosen_city text default null,
  chosen_business_name text default null
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := (select auth.uid());
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
    new.role = old.role;
    new.suspended_at = old.suspended_at;
    new.deleted_at = old.deleted_at;
  end if;
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

create trigger enforce_profile_update
before update on public.profiles
for each row execute function private.enforce_profile_update();

create or replace function private.charge_application_credit()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  new_balance integer;
  project_owner uuid;
begin
  if (select auth.uid()) is distinct from new.tradesperson_id then
    raise exception 'You can only apply as yourself';
  end if;
  if not exists (
    select 1 from public.profiles
    where id = new.tradesperson_id and role = 'tradesperson'
      and suspended_at is null and deleted_at is null
  ) then raise exception 'An active tradesperson profile is required'; end if;

  select homeowner_id into project_owner from public.projects
  where id = new.project_id and status = 'open' for update;
  if project_owner is null then raise exception 'Project is not accepting applications'; end if;

  update public.tradesperson_profiles
  set credits = credits - new.credits_spent, updated_at = timezone('utc', now())
  where user_id = new.tradesperson_id and credits >= new.credits_spent
  returning credits into new_balance;
  if new_balance is null then raise exception 'Not enough credits'; end if;

  insert into public.token_ledger (user_id, delta, reason, project_id, balance_after)
  values (new.tradesperson_id, -new.credits_spent, 'project_application', new.project_id, new_balance);

  insert into public.conversations (project_id, homeowner_id, tradesperson_id)
  values (new.project_id, project_owner, new.tradesperson_id)
  on conflict do nothing;

  update public.projects set applicant_count = applicant_count + 1 where id = new.project_id;
  return new;
end;
$$;
revoke all on function private.charge_application_credit() from public, anon, authenticated;

create trigger charge_application_credit
before insert on public.applications
for each row execute function private.charge_application_credit();

create or replace function public.credit_tokens_for_stripe(
  target_user_id uuid,
  token_amount integer,
  source_event_id text,
  ledger_reason text default 'stripe_purchase'
)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare new_balance integer;
begin
  if token_amount <= 0 then raise exception 'Token amount must be positive'; end if;
  if exists (select 1 from public.token_ledger where stripe_event_id = source_event_id) then
    select balance_after into new_balance from public.token_ledger where stripe_event_id = source_event_id;
    return new_balance;
  end if;
  update public.tradesperson_profiles
  set credits = credits + token_amount, updated_at = timezone('utc', now())
  where user_id = target_user_id
  returning credits into new_balance;
  if new_balance is null then raise exception 'Tradesperson profile not found'; end if;
  insert into public.token_ledger (user_id, delta, reason, stripe_event_id, balance_after)
  values (target_user_id, token_amount, ledger_reason, source_event_id, new_balance);
  return new_balance;
end;
$$;
revoke all on function public.credit_tokens_for_stripe(uuid, integer, text, text) from public, anon, authenticated;
grant execute on function public.credit_tokens_for_stripe(uuid, integer, text, text) to service_role;

do $$
declare table_name text;
begin
  foreach table_name in array array[
    'profiles','user_contacts','categories','tradesperson_profiles','projects','project_media',
    'applications','quotes','conversations','messages','reviews','reports','feedback',
    'subscriptions','token_ledger','stripe_webhook_events'
  ] loop
    execute format('alter table public.%I enable row level security', table_name);
  end loop;
end $$;

create policy "categories are visible" on public.categories for select using (active or private.is_admin());

create policy "public tradesperson profiles" on public.profiles for select
to anon using (role = 'tradesperson' and suspended_at is null and deleted_at is null);
create policy "signed in users view active profiles" on public.profiles for select
to authenticated using (deleted_at is null or id = (select auth.uid()) or private.is_admin());
create policy "users update own profile" on public.profiles for update
to authenticated using (id = (select auth.uid())) with check (id = (select auth.uid()));
create policy "admins update profiles" on public.profiles for update
to authenticated using (private.is_admin()) with check (private.is_admin());

create policy "users view own contacts" on public.user_contacts for select
to authenticated using (user_id = (select auth.uid()) or private.is_admin());
create policy "project counterparts view contacts" on public.user_contacts for select
to authenticated using (exists (
  select 1 from public.applications a join public.projects p on p.id = a.project_id
  where a.status in ('new','shortlisted','accepted') and (
    (p.homeowner_id = user_contacts.user_id and a.tradesperson_id = (select auth.uid())) or
    (a.tradesperson_id = user_contacts.user_id and p.homeowner_id = (select auth.uid()))
  )
));
create policy "users update own contacts" on public.user_contacts for update
to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));

create policy "public tradesperson directory" on public.tradesperson_profiles for select
using (exists (select 1 from public.profiles p where p.id = user_id and p.suspended_at is null and p.deleted_at is null));
create policy "tradespeople update own business" on public.tradesperson_profiles for update
to authenticated using (user_id = (select auth.uid())) with check (user_id = (select auth.uid()));
create policy "admins update tradespeople" on public.tradesperson_profiles for update
to authenticated using (private.is_admin()) with check (private.is_admin());

create policy "signed in users view open projects" on public.projects for select
to authenticated using (status = 'open' or homeowner_id = (select auth.uid()) or awarded_to = (select auth.uid()) or private.is_admin());
create policy "homeowners create projects" on public.projects for insert
to authenticated with check (homeowner_id = (select auth.uid()) and exists (
  select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'homeowner' and p.suspended_at is null
));
create policy "homeowners update own projects" on public.projects for update
to authenticated using (homeowner_id = (select auth.uid()) or private.is_admin())
with check (homeowner_id = (select auth.uid()) or private.is_admin());

create policy "participants view project media" on public.project_media for select
to authenticated using (exists (
  select 1 from public.projects p where p.id = project_id and (
    p.status = 'open' or p.homeowner_id = (select auth.uid()) or p.awarded_to = (select auth.uid()) or private.is_admin()
  )
));
create policy "owners add project media" on public.project_media for insert
to authenticated with check (owner_id = (select auth.uid()) and exists (
  select 1 from public.projects p where p.id = project_id and p.homeowner_id = (select auth.uid())
));

create policy "participants view applications" on public.applications for select
to authenticated using (tradesperson_id = (select auth.uid()) or exists (
  select 1 from public.projects p where p.id = project_id and p.homeowner_id = (select auth.uid())
) or private.is_admin());
create policy "tradespeople apply" on public.applications for insert
to authenticated with check (tradesperson_id = (select auth.uid()));
create policy "participants update applications" on public.applications for update
to authenticated using (tradesperson_id = (select auth.uid()) or exists (
  select 1 from public.projects p where p.id = project_id and p.homeowner_id = (select auth.uid())
) or private.is_admin());

create policy "participants view quotes" on public.quotes for select
to authenticated using (exists (
  select 1 from public.applications a join public.projects p on p.id = a.project_id
  where a.id = application_id and (a.tradesperson_id = (select auth.uid()) or p.homeowner_id = (select auth.uid()))
) or private.is_admin());
create policy "tradespeople create quotes" on public.quotes for insert
to authenticated with check (exists (
  select 1 from public.applications a where a.id = application_id and a.tradesperson_id = (select auth.uid())
));
create policy "quote authors update quotes" on public.quotes for update
to authenticated using (exists (
  select 1 from public.applications a where a.id = application_id and a.tradesperson_id = (select auth.uid())
));

create policy "conversation participants view" on public.conversations for select
to authenticated using (homeowner_id = (select auth.uid()) or tradesperson_id = (select auth.uid()) or private.is_admin());
create policy "conversation participants send messages" on public.messages for insert
to authenticated with check (sender_id = (select auth.uid()) and exists (
  select 1 from public.conversations c where c.id = conversation_id and (c.homeowner_id = (select auth.uid()) or c.tradesperson_id = (select auth.uid()))
));
create policy "conversation participants read messages" on public.messages for select
to authenticated using (exists (
  select 1 from public.conversations c where c.id = conversation_id and (c.homeowner_id = (select auth.uid()) or c.tradesperson_id = (select auth.uid()))
) or private.is_admin());
create policy "recipients mark messages read" on public.messages for update
to authenticated using (sender_id <> (select auth.uid()) and exists (
  select 1 from public.conversations c where c.id = conversation_id and (c.homeowner_id = (select auth.uid()) or c.tradesperson_id = (select auth.uid()))
));

create policy "reviews are public" on public.reviews for select using (true);
create policy "homeowners review completed projects" on public.reviews for insert
to authenticated with check (homeowner_id = (select auth.uid()) and exists (
  select 1 from public.projects p where p.id = project_id and p.homeowner_id = (select auth.uid())
    and p.awarded_to = tradesperson_id and p.status = 'completed'
));
create policy "reviewers update reviews" on public.reviews for update
to authenticated using (homeowner_id = (select auth.uid()) or private.is_admin());

create policy "users create reports" on public.reports for insert
to authenticated with check (reporter_id = (select auth.uid()));
create policy "reporters and admins view reports" on public.reports for select
to authenticated using (reporter_id = (select auth.uid()) or private.is_admin());
create policy "admins update reports" on public.reports for update
to authenticated using (private.is_admin()) with check (private.is_admin());

create policy "anyone leaves feedback" on public.feedback for insert
to anon, authenticated with check (user_id is null or user_id = (select auth.uid()));
create policy "admins view feedback" on public.feedback for select
to authenticated using (private.is_admin());

create policy "users view own subscription" on public.subscriptions for select
to authenticated using (user_id = (select auth.uid()) or private.is_admin());
create policy "users view own token ledger" on public.token_ledger for select
to authenticated using (user_id = (select auth.uid()) or private.is_admin());
create policy "service role manages stripe events" on public.stripe_webhook_events for all
to service_role using (true) with check (true);

grant select on public.categories, public.tradesperson_profiles, public.reviews to anon, authenticated;
grant select, update on public.profiles, public.user_contacts to authenticated;
grant select, insert, update on public.projects, public.project_media, public.applications, public.quotes, public.messages, public.reviews, public.reports to authenticated;
grant select on public.conversations, public.subscriptions, public.token_ledger to authenticated;
grant insert on public.feedback to anon, authenticated;
grant select on public.feedback to authenticated;
grant all on all tables in schema public to service_role;

insert into public.categories (slug, name, image_path) values
  ('builders', 'Builders', '/images/builders.png'),
  ('landscaping', 'Landscaping', '/images/landscaping.png'),
  ('handyman', 'Handyman', '/images/handyman.png'),
  ('plumbing', 'Plumbing', '/images/plumbing.png'),
  ('flooring', 'Flooring', '/images/flooring.png'),
  ('roofing', 'Roofing', '/images/roofing.png'),
  ('electrical', 'Electrical', '/images/electrical.png'),
  ('painting', 'Painting', '/images/painting.png')
on conflict (slug) do update set name = excluded.name, image_path = excluded.image_path, active = true;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('avatars', 'avatars', true, 5242880, array['image/jpeg','image/png','image/webp']),
  ('project-media', 'project-media', false, 26214400, array['image/jpeg','image/png','image/webp','video/mp4','video/quicktime'])
on conflict (id) do update set file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

create policy "avatar uploads use own folder" on storage.objects for insert
to authenticated with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "public reads avatars" on storage.objects for select
using (bucket_id = 'avatars');
create policy "owners update avatars" on storage.objects for update
to authenticated using (bucket_id = 'avatars' and owner_id = (select auth.uid()::text))
with check (bucket_id = 'avatars' and owner_id = (select auth.uid()::text));
create policy "homeowners upload project media" on storage.objects for insert
to authenticated with check (bucket_id = 'project-media' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "owners manage project media" on storage.objects for all
to authenticated using (bucket_id = 'project-media' and owner_id = (select auth.uid()::text))
with check (bucket_id = 'project-media' and owner_id = (select auth.uid()::text));

create trigger profiles_set_updated_at before update on public.profiles for each row execute function private.set_updated_at();
create trigger contacts_set_updated_at before update on public.user_contacts for each row execute function private.set_updated_at();
create trigger tradespeople_set_updated_at before update on public.tradesperson_profiles for each row execute function private.set_updated_at();
create trigger projects_set_updated_at before update on public.projects for each row execute function private.set_updated_at();
create trigger applications_set_updated_at before update on public.applications for each row execute function private.set_updated_at();
create trigger quotes_set_updated_at before update on public.quotes for each row execute function private.set_updated_at();
create trigger reviews_set_updated_at before update on public.reviews for each row execute function private.set_updated_at();
create trigger reports_set_updated_at before update on public.reports for each row execute function private.set_updated_at();
create trigger subscriptions_set_updated_at before update on public.subscriptions for each row execute function private.set_updated_at();

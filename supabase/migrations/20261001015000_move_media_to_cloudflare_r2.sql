-- User-generated media is stored in a private Cloudflare R2 bucket.
-- Postgres keeps only object keys so RLS remains the authorization source.

alter table public.messages
  add column if not exists attachment_paths text[] not null default '{}';

alter table public.quotes
  add column if not exists attachment_paths text[] not null default '{}';

drop policy if exists "avatar uploads use own folder" on storage.objects;
drop policy if exists "public reads avatars" on storage.objects;
drop policy if exists "owners update avatars" on storage.objects;
drop policy if exists "homeowners upload project media" on storage.objects;
drop policy if exists "owners manage project media" on storage.objects;

-- Supabase protects storage tables from direct deletion. The now-unused legacy
-- buckets can be removed through the Storage API after deployment if desired.

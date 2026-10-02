drop policy if exists "categories are visible" on public.categories;

create policy "public sees active categories"
on public.categories
for select
to anon
using (active);

create policy "signed in users see categories"
on public.categories
for select
to authenticated
using (active or private.is_admin());

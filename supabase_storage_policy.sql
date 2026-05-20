-- Supabase profile and storage policy guidance for Money Rank
--
-- 1) If you want avatars to be publicly accessible via getPublicUrl(),
-- create or configure the storage bucket as public in Supabase.
-- In the Supabase dashboard, set the bucket "avatars" to public.

-- 2) Enable row-level security on the alunos table and allow users to update their own row:
-- Note: only apply this if your project uses RLS.

alter table public.alunos enable row level security;

create policy "Public select on alunos" on public.alunos
  for select using (true);

create policy "Authenticated student can update own profile" on public.alunos
  for update using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Authenticated student can insert own profile" on public.alunos
  for insert with check (auth.uid() = id);

-- 3) If you want a stricter public read policy, use a view or a custom function instead of allowing
-- unfiltered public selects on public.alunos.
-- 4) The avatar upload bucket should be public or accessed through signed URLs.
--    If you later prefer private storage, replace getPublicUrl() with a signed URL flow.

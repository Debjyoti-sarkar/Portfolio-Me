-- =============================================================================
-- Portfolio schema. Everything lives in its own `portfolio` schema so it can
-- share a Supabase project with another app (HearMe) without touching that
-- app's `public` tables, functions, buckets or auth settings.
-- RLS is enabled on every table.
-- =============================================================================

create schema if not exists portfolio;
grant usage on schema portfolio to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Admin allow-list + helper
-- ---------------------------------------------------------------------------
create table portfolio.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table portfolio.admins enable row level security;

-- SECURITY DEFINER so policies can call it without granting read on admins.
create or replace function portfolio.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from portfolio.admins a where a.user_id = (select auth.uid())
  );
$$;

revoke all on function portfolio.is_admin() from public;
grant execute on function portfolio.is_admin() to anon, authenticated;

create policy "admins can see the admin list"
  on portfolio.admins for select
  to authenticated
  using ((select portfolio.is_admin()));

-- ---------------------------------------------------------------------------
-- Shared trigger: keep updated_at current
-- ---------------------------------------------------------------------------
create or replace function portfolio.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ---------------------------------------------------------------------------
-- Content: projects
-- ---------------------------------------------------------------------------
create table portfolio.projects (
  id            uuid primary key default gen_random_uuid(),
  slug          text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title         text not null check (char_length(title) between 1 and 120),
  tagline       text not null check (char_length(tagline) between 1 and 200),
  summary       text not null,
  problem       text,
  role          text,
  architecture  text,
  challenges    text,
  results       text,
  tech          text[] not null default '{}',
  categories    text[] not null default '{}',
  social_impact boolean not null default false,
  featured      boolean not null default false,
  award         text,
  period        text,
  credits       text,
  github_url    text check (github_url is null or github_url ~ '^https://'),
  live_url      text check (live_url is null or live_url ~ '^https://'),
  cover_image   text,
  gallery       jsonb not null default '[]'::jsonb check (jsonb_typeof(gallery) = 'array'),
  status        text not null default 'draft' check (status in ('draft', 'published')),
  sort_order    integer not null default 100,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index projects_listing_idx on portfolio.projects (status, social_impact desc, sort_order);
create trigger projects_updated_at before update on portfolio.projects
  for each row execute function portfolio.set_updated_at();

-- ---------------------------------------------------------------------------
-- Content: skills
-- ---------------------------------------------------------------------------
create table portfolio.skills (
  id          uuid primary key default gen_random_uuid(),
  name        text not null check (char_length(name) between 1 and 60),
  group_name  text not null check (char_length(group_name) between 1 and 60),
  group_order integer not null default 100,
  sort_order  integer not null default 100,
  created_at  timestamptz not null default now(),
  unique (group_name, name)
);

-- ---------------------------------------------------------------------------
-- Content: experiences (work, leadership, education)
-- ---------------------------------------------------------------------------
create table portfolio.experiences (
  id           uuid primary key default gen_random_uuid(),
  kind         text not null check (kind in ('work', 'leadership', 'education')),
  role         text not null,
  organization text not null,
  location     text,
  start_date   date not null,
  end_date     date,
  highlights   text[] not null default '{}',
  sort_order   integer not null default 100,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  check (end_date is null or end_date >= start_date)
);

create trigger experiences_updated_at before update on portfolio.experiences
  for each row execute function portfolio.set_updated_at();

-- ---------------------------------------------------------------------------
-- Content: achievements (hackathons, awards)
-- ---------------------------------------------------------------------------
create table portfolio.achievements (
  id           uuid primary key default gen_random_uuid(),
  title        text not null,
  event        text not null,
  description  text,
  date         date not null,
  -- how much of `date` is real: never display a day/month we don't know
  date_precision text not null default 'month' check (date_precision in ('day', 'month', 'year')),
  kind         text not null default 'hackathon' check (kind in ('hackathon', 'award', 'academic')),
  project_slug text references portfolio.projects (slug) on update cascade on delete set null,
  created_at   timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Content: blog posts / notes
-- ---------------------------------------------------------------------------
create table portfolio.blog_posts (
  id              uuid primary key default gen_random_uuid(),
  slug            text not null unique check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  title           text not null check (char_length(title) between 1 and 160),
  excerpt         text not null default '',
  content         text not null default '',
  tags            text[] not null default '{}',
  cover_image     text,
  published       boolean not null default false,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  check (not published or published_at is not null)
);

create index blog_posts_published_idx on portfolio.blog_posts (published, published_at desc);
create trigger blog_posts_updated_at before update on portfolio.blog_posts
  for each row execute function portfolio.set_updated_at();

-- ---------------------------------------------------------------------------
-- Contact inbox. Written ONLY by the `contact` Edge Function (service role),
-- which validates, rate-limits and filters spam. No anon/authenticated
-- insert or read policy exists, so the public cannot read or bypass the
-- function. Admins can read and triage.
-- ---------------------------------------------------------------------------
create table portfolio.contact_messages (
  id         uuid primary key default gen_random_uuid(),
  name       text not null check (char_length(name) between 1 and 100),
  email      text not null check (char_length(email) between 3 and 254),
  message    text not null check (char_length(message) between 10 and 5000),
  -- salted SHA-256 of the sender IP, used only for rate limiting
  ip_hash    text not null,
  read       boolean not null default false,
  created_at timestamptz not null default now()
);

create index contact_messages_rate_idx on portfolio.contact_messages (ip_hash, created_at desc);

-- ---------------------------------------------------------------------------
-- Privacy-friendly analytics: no IPs, no user agents, no cookies, no ids.
-- ---------------------------------------------------------------------------
create table portfolio.analytics_events (
  id            bigint generated always as identity primary key,
  event         text not null check (event in ('page_view', 'resume_download', 'outbound_click', 'contact_submit')),
  path          text not null check (char_length(path) between 1 and 300 and path like '/%'),
  referrer_host text check (referrer_host is null or char_length(referrer_host) <= 255),
  device        text check (device in ('mobile', 'tablet', 'desktop')),
  created_at    timestamptz not null default now()
);

create index analytics_events_created_idx on portfolio.analytics_events (created_at desc);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------
alter table portfolio.projects         enable row level security;
alter table portfolio.skills           enable row level security;
alter table portfolio.experiences      enable row level security;
alter table portfolio.achievements     enable row level security;
alter table portfolio.blog_posts       enable row level security;
alter table portfolio.contact_messages enable row level security;
alter table portfolio.analytics_events enable row level security;

-- Public reads: only published content
create policy "public reads published projects" on portfolio.projects
  for select to anon, authenticated
  using (status = 'published' or (select portfolio.is_admin()));
create policy "public reads skills" on portfolio.skills
  for select to anon, authenticated using (true);
create policy "public reads experiences" on portfolio.experiences
  for select to anon, authenticated using (true);
create policy "public reads achievements" on portfolio.achievements
  for select to anon, authenticated using (true);
create policy "public reads published posts" on portfolio.blog_posts
  for select to anon, authenticated
  using (published or (select portfolio.is_admin()));

-- Admin writes on content tables
do $$
declare t text;
begin
  foreach t in array array['projects', 'skills', 'experiences', 'achievements', 'blog_posts'] loop
    execute format(
      'create policy "admin inserts %1$s" on portfolio.%1$I for insert to authenticated with check ((select portfolio.is_admin()))', t);
    execute format(
      'create policy "admin updates %1$s" on portfolio.%1$I for update to authenticated using ((select portfolio.is_admin())) with check ((select portfolio.is_admin()))', t);
    execute format(
      'create policy "admin deletes %1$s" on portfolio.%1$I for delete to authenticated using ((select portfolio.is_admin()))', t);
  end loop;
end $$;

-- Contact inbox: admin-only read/update/delete (inserts come from the Edge Function)
create policy "admin reads messages" on portfolio.contact_messages
  for select to authenticated using ((select portfolio.is_admin()));
create policy "admin updates messages" on portfolio.contact_messages
  for update to authenticated
  using ((select portfolio.is_admin())) with check ((select portfolio.is_admin()));
create policy "admin deletes messages" on portfolio.contact_messages
  for delete to authenticated using ((select portfolio.is_admin()));

-- Analytics: anyone may record an event (constrained by CHECKs), only admin reads
create policy "anyone records events" on portfolio.analytics_events
  for insert to anon, authenticated with check (true);
create policy "admin reads events" on portfolio.analytics_events
  for select to authenticated using ((select portfolio.is_admin()));


-- ---------------------------------------------------------------------------
-- Table privileges (a non-public schema gets no default grants).
-- RLS policies above still decide which rows each role can touch.
-- ---------------------------------------------------------------------------
grant select on portfolio.projects, portfolio.skills, portfolio.experiences,
  portfolio.achievements, portfolio.blog_posts to anon, authenticated;
grant insert, update, delete on portfolio.projects, portfolio.skills, portfolio.experiences,
  portfolio.achievements, portfolio.blog_posts to authenticated;
grant select on portfolio.admins to authenticated;
-- contact inbox: no anon privileges at all; admin triages via RLS
grant select, update, delete on portfolio.contact_messages to authenticated;
-- analytics: anyone may insert, only admins read (RLS)
grant insert on portfolio.analytics_events to anon, authenticated;
grant select on portfolio.analytics_events to authenticated;
grant all on all tables in schema portfolio to service_role;
grant usage on all sequences in schema portfolio to anon, authenticated, service_role;

-- ---------------------------------------------------------------------------
-- Analytics summary for the admin dashboard (runs with caller's rights,
-- so RLS still restricts it to admins).
-- ---------------------------------------------------------------------------
create or replace function portfolio.analytics_summary(days integer default 30)
returns table (path text, event text, total bigint)
language sql
stable
security invoker
set search_path = ''
as $$
  select e.path, e.event, count(*)::bigint as total
  from portfolio.analytics_events e
  where e.created_at >= now() - make_interval(days => greatest(1, least(days, 365)))
  group by e.path, e.event
  order by total desc
  limit 200;
$$;

grant execute on function portfolio.analytics_summary(integer) to authenticated;

-- ---------------------------------------------------------------------------
-- Storage: public-read buckets, admin-only writes
-- ---------------------------------------------------------------------------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values
  ('portfolio-media', 'portfolio-media', true, 10485760,
    array['image/png', 'image/jpeg', 'image/webp', 'image/avif', 'image/gif', 'video/mp4', 'video/webm']),
  ('portfolio-documents', 'portfolio-documents', true, 5242880, array['application/pdf'])
on conflict (id) do nothing;

create policy "portfolio: public reads portfolio buckets" on storage.objects
  for select to anon, authenticated
  using (bucket_id in ('portfolio-media', 'portfolio-documents'));
create policy "portfolio: admin uploads to portfolio buckets" on storage.objects
  for insert to authenticated
  with check (bucket_id in ('portfolio-media', 'portfolio-documents') and (select portfolio.is_admin()));
create policy "portfolio: admin updates portfolio buckets" on storage.objects
  for update to authenticated
  using (bucket_id in ('portfolio-media', 'portfolio-documents') and (select portfolio.is_admin()));
create policy "portfolio: admin deletes from portfolio buckets" on storage.objects
  for delete to authenticated
  using (bucket_id in ('portfolio-media', 'portfolio-documents') and (select portfolio.is_admin()));

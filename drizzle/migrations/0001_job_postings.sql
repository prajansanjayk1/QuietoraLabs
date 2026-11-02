-- QuietoraLabs Job Postings Schema
-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/jukxlrlgvwpfruukcqgq/sql)

create table if not exists public.job_postings (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  department text not null,
  location text not null default 'Remote (India)',
  type text not null default 'Full-time',
  experience_level text not null default '2-5 years',
  salary_range text,
  summary text not null,
  description text not null,
  responsibilities jsonb not null default '[]'::jsonb,
  requirements jsonb not null default '[]'::jsonb,
  perks jsonb not null default '[]'::jsonb,
  status text not null default 'published' check (status in ('published', 'draft', 'closed')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.job_postings enable row level security;

-- Policies
create policy "Anyone can read published job postings"
  on public.job_postings for select
  using (status = 'published');

create policy "Admins can do everything on job postings"
  on public.job_postings for all
  to authenticated
  using (public.has_role(auth.uid(), 'admin'))
  with check (public.has_role(auth.uid(), 'admin'));

-- Grants
grant select on public.job_postings to anon, authenticated;
grant all on public.job_postings to authenticated;
grant all on public.job_postings to service_role;

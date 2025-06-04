alter table public.chat_messages
  add column if not exists reply_to uuid references public.chat_messages(id);

create table if not exists public.chat_reports (
  id uuid primary key default gen_random_uuid(),
  chat_message_id uuid not null references public.chat_messages(id) on delete cascade,
  user_id uuid null default auth.uid(),
  created_at timestamp with time zone not null default now()
);

alter table public.chat_reports enable row level security;

grant select, insert on table public.chat_reports to authenticated;

drop policy if exists "Allow insert" on public.chat_reports;
create policy "Allow insert" on public.chat_reports
  for insert to authenticated with check (true);

create table if not exists "public"."chat_messages" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "content" text not null,
    "user_id" uuid,
    "shop_id" uuid not null references public.shops(id) on delete cascade,
    "image" text,
    constraint chat_messages_pkey primary key (id)
);

alter table "public"."chat_messages" enable row level security;

-- grants for table "chat_messages" --- ensure API access
grant select, insert on table "public"."chat_messages" to anon, authenticated;

drop policy if exists "Allow read" on public.chat_messages;
create policy "Allow read" on "public"."chat_messages"
  for select using (true);

drop policy if exists "Allow insert" on public.chat_messages;
create policy "Allow insert" on "public"."chat_messages"
  for insert to authenticated with check (true);

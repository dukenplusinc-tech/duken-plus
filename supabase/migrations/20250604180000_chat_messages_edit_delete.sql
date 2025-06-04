alter table public.chat_messages
  add column if not exists updated_at timestamp with time zone,
  add column if not exists deleted_at timestamp with time zone;

drop policy if exists "Allow update own chat messages" on public.chat_messages;
create policy "Allow update own chat messages" on public.chat_messages
as permissive
for update
to public
using ((user_id = auth.uid()));

drop policy if exists "Allow delete own chat messages" on public.chat_messages;
create policy "Allow delete own chat messages" on public.chat_messages
as permissive
for delete
to public
using ((user_id = auth.uid()));

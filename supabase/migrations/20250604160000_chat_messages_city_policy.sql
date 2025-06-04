-- Drop existing read policy
drop policy if exists "Allow read" on public.chat_messages;

-- Allow selecting chat messages where the shop city matches the current user's shop city
create policy "Allow read in city" on public.chat_messages
as permissive
for select
to public
using (
  shop_id in (
    select id from shops where city = (
      select city from shops where id = (
        select shop_id from profiles where id = auth.uid()
      )
    )
  )
);

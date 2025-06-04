-- Automatically sync blacklist flag with overdue status
create or replace function public.sync_blacklist_with_overdue()
returns trigger
language plpgsql
as $$
begin
  if new.is_overdue and (old.blacklist is distinct from true) then
    new.blacklist := true;
  elsif not new.is_overdue and (old.blacklist is distinct from false) then
    new.blacklist := false;
  end if;
  return new;
end;
$$;

drop trigger if exists trg_sync_blacklist_with_overdue on public.debtors;

create trigger trg_sync_blacklist_with_overdue
before insert or update of is_overdue
on public.debtors
for each row
execute function public.sync_blacklist_with_overdue();

-- View to list blacklisted debtors along with their city
create or replace view public.blacklisted_debtors_by_city as
select d.*, s.city
from public.debtors d
join public.shops s on d.shop_id = s.id
where d.blacklist = true;

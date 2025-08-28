drop function if exists "public"."recalculate_is_overdue"(debtor_id uuid);

CREATE INDEX idx_dt_debtor_type_date ON public.debtor_transactions USING btree (debtor_id, transaction_type, transaction_date DESC);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.recalculate_is_overdue(p_debtor_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
declare
  last_positive_tx timestamp; -- last PURCHASE (payback)
  last_negative_tx timestamp; -- last LOAN (debt)
  v_balance        numeric;
  overdue          boolean;
begin
  -- current balance (negative means owes)
  select d.balance into v_balance
  from public.debtors d
  where d.id = p_debtor_id;

  -- last dates by type
  select
    max(transaction_date) filter (where transaction_type = 'purchase'),
    max(transaction_date) filter (where transaction_type = 'loan')
  into last_positive_tx, last_negative_tx
  from public.debtor_transactions
  where debtor_id = p_debtor_id;

  -- overdue: still owes AND (no payback for 30d OR never paid back and last loan 30d)
  overdue :=
    (v_balance < 0) and (
      (last_positive_tx is not null and last_positive_tx <= now() - interval '30 days')
      or
      (last_positive_tx is null and last_negative_tx is not null and last_negative_tx <= now() - interval '30 days')
    );

  update public.debtors
     set is_overdue = coalesce(overdue, false),
         updated_at = now()
   where id = p_debtor_id;
end;
$function$
;

create or replace view "public"."debtor_statistics" as  SELECT d.shop_id,
    count(*) FILTER (WHERE (d.is_overdue = true)) AS overdue_debtors,
    sum(
        CASE
            WHEN (d.balance >= (0)::numeric) THEN d.balance
            ELSE (0)::numeric
        END) AS total_positive_balance,
    sum(
        CASE
            WHEN (d.balance < (0)::numeric) THEN d.balance
            ELSE (0)::numeric
        END) AS total_negative_balance
   FROM debtors d
  WHERE (d.shop_id = ( SELECT p.shop_id
           FROM profiles p
          WHERE (p.id = auth.uid())))
  GROUP BY d.shop_id;


CREATE OR REPLACE FUNCTION public.update_debtor_balance()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  update public.debtors d
     set balance = (
           select coalesce(sum(
                    case
                      when dt.transaction_type = 'purchase' then dt.amount
                      when dt.transaction_type = 'loan'     then -dt.amount
                    end
                  ), 0)
           from public.debtor_transactions dt
           where dt.debtor_id = new.debtor_id
         ),
         updated_at = now()
   where d.id = new.debtor_id;

  perform public.recalculate_is_overdue(new.debtor_id);
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.update_debtor_balance_after_delete()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
begin
  update public.debtors d
     set balance = (
           select coalesce(sum(
                    case
                      when dt.transaction_type = 'purchase' then dt.amount
                      when dt.transaction_type = 'loan'     then -dt.amount   -- fixed
                    end
                  ), 0)
           from public.debtor_transactions dt
           where dt.debtor_id = old.debtor_id
         ),
         updated_at = now()
   where d.id = old.debtor_id;

  perform public.recalculate_is_overdue(old.debtor_id);
  return old;
end;
$function$
;



drop view if exists "public"."cash_shift_dashboard";

create or replace view "public"."cash_shift_dashboard" as  SELECT s.shop_id,
    s.id AS shift_id,
    s.shift_number,
    s.status,
    s.opened_at,
    s.closes_at,
    s.closed_at,
    s.closing_cash,
    s.closing_banks,
    COALESCE(cash.cash_total, (0)::numeric) AS cash_total,
    COALESCE(bank.bank_total, (0)::numeric) AS bank_total
   FROM ((public.cash_shifts s
     LEFT JOIN ( SELECT cash_register.shift_id,
            sum(cash_register.amount) AS cash_total
           FROM public.cash_register
          WHERE (cash_register.type = 'cash'::public.transaction_type)
          GROUP BY cash_register.shift_id) cash ON ((cash.shift_id = s.id)))
     LEFT JOIN ( SELECT cash_register.shift_id,
            sum(cash_register.amount) AS bank_total
           FROM public.cash_register
          WHERE (cash_register.type = 'bank_transfer'::public.transaction_type)
          GROUP BY cash_register.shift_id) bank ON ((bank.shift_id = s.id)));




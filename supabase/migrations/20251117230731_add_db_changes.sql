drop view if exists "public"."debtor_statistics";

alter table "public"."expenses" alter column "created_at" set data type timestamp with time zone using "created_at"::timestamp with time zone;

alter table "public"."expenses" alter column "date" set data type timestamp with time zone using "date"::timestamp with time zone;

create or replace view "public"."debtor_statistics" as  SELECT d.shop_id,
    count(*) AS total_debtors,
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




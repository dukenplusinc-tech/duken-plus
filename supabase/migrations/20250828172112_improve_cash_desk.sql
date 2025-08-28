create or replace view "public"."cash_register_ui_view" as  WITH bank_sums AS (
         SELECT cr.shop_id,
            cr.bank_name,
            sum(cr.amount) AS amount
           FROM cash_register cr
          WHERE ((cr.type = 'bank_transfer'::transaction_type) AND (((cr.date AT TIME ZONE 'Asia/Almaty'::text))::date = ((now() AT TIME ZONE 'Asia/Almaty'::text))::date))
          GROUP BY cr.shop_id, cr.bank_name
        )
 SELECT a.shop_id,
    COALESCE(sum(
        CASE
            WHEN (a.type = 'cash'::transaction_type) THEN a.amount
            ELSE NULL::numeric
        END), (0)::numeric) AS cash_total,
    COALESCE(sum(
        CASE
            WHEN (a.type = 'bank_transfer'::transaction_type) THEN a.amount
            ELSE NULL::numeric
        END), (0)::numeric) AS bank_total,
    COALESCE(sum(a.amount), (0)::numeric) AS total_amount,
    ( SELECT json_agg(json_build_object('bank_name', b.bank_name, 'amount', b.amount)) AS json_agg
           FROM bank_sums b
          WHERE (b.shop_id = a.shop_id)) AS banks
   FROM cash_register a
  WHERE (((a.date AT TIME ZONE 'Asia/Almaty'::text))::date = ((now() AT TIME ZONE 'Asia/Almaty'::text))::date)
  GROUP BY a.shop_id;




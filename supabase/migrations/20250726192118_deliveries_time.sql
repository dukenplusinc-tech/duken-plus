alter table "public"."deliveries" add column "consignment_status" text default 'open'::text;

alter table "public"."deliveries" add column "expected_time" time without time zone;

alter table "public"."deliveries" add constraint "deliveries_consignment_status_check" CHECK ((consignment_status = ANY (ARRAY['open'::text, 'closed'::text]))) not valid;

alter table "public"."deliveries" validate constraint "deliveries_consignment_status_check";



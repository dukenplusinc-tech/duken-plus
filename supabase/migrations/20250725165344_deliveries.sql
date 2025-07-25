create type "public"."delivery_status" as enum ('pending', 'accepted', 'due');

create table "public"."deliveries" (
    "id" uuid not null default gen_random_uuid(),
    "contractor_id" uuid not null,
    "status" delivery_status not null default 'pending'::delivery_status,
    "expected_date" date not null,
    "accepted_date" date,
    "amount_expected" numeric(12,2) not null,
    "amount_received" numeric(12,2),
    "is_consignement" boolean not null default false,
    "consignment_due_date" date,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now(),
    "shop_id" uuid not null
);


alter table "public"."deliveries" enable row level security;

CREATE UNIQUE INDEX deliveries_pkey ON public.deliveries USING btree (id);

alter table "public"."deliveries" add constraint "deliveries_pkey" PRIMARY KEY using index "deliveries_pkey";

alter table "public"."deliveries" add constraint "deliveries_contractor_id_fkey" FOREIGN KEY (contractor_id) REFERENCES contractors(id) ON DELETE CASCADE not valid;

alter table "public"."deliveries" validate constraint "deliveries_contractor_id_fkey";

alter table "public"."deliveries" add constraint "deliveries_shop_id_fkey" FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE not valid;

alter table "public"."deliveries" validate constraint "deliveries_shop_id_fkey";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.current_shop_id()
 RETURNS uuid
 LANGUAGE sql
 STABLE
AS $function$
  SELECT shop_id
  FROM profiles
  WHERE id = auth.uid()
  LIMIT 1
$function$
;

grant delete on table "public"."deliveries" to "anon";

grant insert on table "public"."deliveries" to "anon";

grant references on table "public"."deliveries" to "anon";

grant select on table "public"."deliveries" to "anon";

grant trigger on table "public"."deliveries" to "anon";

grant truncate on table "public"."deliveries" to "anon";

grant update on table "public"."deliveries" to "anon";

grant delete on table "public"."deliveries" to "authenticated";

grant insert on table "public"."deliveries" to "authenticated";

grant references on table "public"."deliveries" to "authenticated";

grant select on table "public"."deliveries" to "authenticated";

grant trigger on table "public"."deliveries" to "authenticated";

grant truncate on table "public"."deliveries" to "authenticated";

grant update on table "public"."deliveries" to "authenticated";

grant delete on table "public"."deliveries" to "service_role";

grant insert on table "public"."deliveries" to "service_role";

grant references on table "public"."deliveries" to "service_role";

grant select on table "public"."deliveries" to "service_role";

grant trigger on table "public"."deliveries" to "service_role";

grant truncate on table "public"."deliveries" to "service_role";

grant update on table "public"."deliveries" to "service_role";

create policy "Can delete own shop deliveries"
on "public"."deliveries"
as permissive
for delete
to public
using ((shop_id = current_shop_id()));


create policy "Can insert into own shop deliveries"
on "public"."deliveries"
as permissive
for insert
to public
with check ((shop_id = current_shop_id()));


create policy "Can select own shop deliveries"
on "public"."deliveries"
as permissive
for select
to public
using ((shop_id = current_shop_id()));


create policy "Can update own shop deliveries"
on "public"."deliveries"
as permissive
for update
to public
using ((shop_id = current_shop_id()));




create table "public"."cities" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "external_id" text not null,
    "region" text
);


alter table "public"."cities" enable row level security;

create table "public"."contractors" (
    "id" uuid not null default uuid_generate_v4(),
    "title" text not null,
    "supervisor" text,
    "supervisor_phone" text,
    "sales_representative" text,
    "sales_representative_phone" text,
    "address" text,
    "contract" text,
    "note" text,
    "shop_id" uuid,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."contractors" enable row level security;

create table "public"."notes" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null default auth.uid(),
    "title" text not null default ''::text,
    "content" text not null default ''::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."notes" enable row level security;

create table "public"."shops" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "address" text not null default ''::text,
    "city" text not null default ''::text
);


alter table "public"."shops" enable row level security;

alter table "public"."profiles" add column "language" text default 'en'::text;

alter table "public"."profiles" add column "shop_id" uuid;

CREATE UNIQUE INDEX cities_pkey ON public.cities USING btree (id);

CREATE UNIQUE INDEX contractors_pkey ON public.contractors USING btree (id);

CREATE UNIQUE INDEX notes_pkey ON public.notes USING btree (id);

CREATE UNIQUE INDEX shops_pkey ON public.shops USING btree (id);

CREATE UNIQUE INDEX unique_external_id ON public.cities USING btree (external_id);

alter table "public"."cities" add constraint "cities_pkey" PRIMARY KEY using index "cities_pkey";

alter table "public"."contractors" add constraint "contractors_pkey" PRIMARY KEY using index "contractors_pkey";

alter table "public"."notes" add constraint "notes_pkey" PRIMARY KEY using index "notes_pkey";

alter table "public"."shops" add constraint "shops_pkey" PRIMARY KEY using index "shops_pkey";

alter table "public"."cities" add constraint "unique_external_id" UNIQUE using index "unique_external_id";

alter table "public"."contractors" add constraint "contractors_shop_id_fkey" FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE not valid;

alter table "public"."contractors" validate constraint "contractors_shop_id_fkey";

alter table "public"."notes" add constraint "notes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."notes" validate constraint "notes_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_shop_id_fkey" FOREIGN KEY (shop_id) REFERENCES shops(id) not valid;

alter table "public"."profiles" validate constraint "profiles_shop_id_fkey";

create or replace view "public"."extended_profile" as  SELECT p.id,
    p.full_name,
    p.avatar_url,
    p.role_id,
    p.language,
    p.created_at,
    p.updated_at,
    u.email,
    u.phone
   FROM (profiles p
     JOIN auth.users u ON ((p.id = u.id)));


grant delete on table "public"."cities" to "anon";

grant insert on table "public"."cities" to "anon";

grant references on table "public"."cities" to "anon";

grant select on table "public"."cities" to "anon";

grant trigger on table "public"."cities" to "anon";

grant truncate on table "public"."cities" to "anon";

grant update on table "public"."cities" to "anon";

grant delete on table "public"."cities" to "authenticated";

grant insert on table "public"."cities" to "authenticated";

grant references on table "public"."cities" to "authenticated";

grant select on table "public"."cities" to "authenticated";

grant trigger on table "public"."cities" to "authenticated";

grant truncate on table "public"."cities" to "authenticated";

grant update on table "public"."cities" to "authenticated";

grant delete on table "public"."cities" to "service_role";

grant insert on table "public"."cities" to "service_role";

grant references on table "public"."cities" to "service_role";

grant select on table "public"."cities" to "service_role";

grant trigger on table "public"."cities" to "service_role";

grant truncate on table "public"."cities" to "service_role";

grant update on table "public"."cities" to "service_role";

grant delete on table "public"."contractors" to "anon";

grant insert on table "public"."contractors" to "anon";

grant references on table "public"."contractors" to "anon";

grant select on table "public"."contractors" to "anon";

grant trigger on table "public"."contractors" to "anon";

grant truncate on table "public"."contractors" to "anon";

grant update on table "public"."contractors" to "anon";

grant delete on table "public"."contractors" to "authenticated";

grant insert on table "public"."contractors" to "authenticated";

grant references on table "public"."contractors" to "authenticated";

grant select on table "public"."contractors" to "authenticated";

grant trigger on table "public"."contractors" to "authenticated";

grant truncate on table "public"."contractors" to "authenticated";

grant update on table "public"."contractors" to "authenticated";

grant delete on table "public"."contractors" to "service_role";

grant insert on table "public"."contractors" to "service_role";

grant references on table "public"."contractors" to "service_role";

grant select on table "public"."contractors" to "service_role";

grant trigger on table "public"."contractors" to "service_role";

grant truncate on table "public"."contractors" to "service_role";

grant update on table "public"."contractors" to "service_role";

grant delete on table "public"."notes" to "anon";

grant insert on table "public"."notes" to "anon";

grant references on table "public"."notes" to "anon";

grant select on table "public"."notes" to "anon";

grant trigger on table "public"."notes" to "anon";

grant truncate on table "public"."notes" to "anon";

grant update on table "public"."notes" to "anon";

grant delete on table "public"."notes" to "authenticated";

grant insert on table "public"."notes" to "authenticated";

grant references on table "public"."notes" to "authenticated";

grant select on table "public"."notes" to "authenticated";

grant trigger on table "public"."notes" to "authenticated";

grant truncate on table "public"."notes" to "authenticated";

grant update on table "public"."notes" to "authenticated";

grant delete on table "public"."notes" to "service_role";

grant insert on table "public"."notes" to "service_role";

grant references on table "public"."notes" to "service_role";

grant select on table "public"."notes" to "service_role";

grant trigger on table "public"."notes" to "service_role";

grant truncate on table "public"."notes" to "service_role";

grant update on table "public"."notes" to "service_role";

grant delete on table "public"."shops" to "anon";

grant insert on table "public"."shops" to "anon";

grant references on table "public"."shops" to "anon";

grant select on table "public"."shops" to "anon";

grant trigger on table "public"."shops" to "anon";

grant truncate on table "public"."shops" to "anon";

grant update on table "public"."shops" to "anon";

grant delete on table "public"."shops" to "authenticated";

grant insert on table "public"."shops" to "authenticated";

grant references on table "public"."shops" to "authenticated";

grant select on table "public"."shops" to "authenticated";

grant trigger on table "public"."shops" to "authenticated";

grant truncate on table "public"."shops" to "authenticated";

grant update on table "public"."shops" to "authenticated";

grant delete on table "public"."shops" to "service_role";

grant insert on table "public"."shops" to "service_role";

grant references on table "public"."shops" to "service_role";

grant select on table "public"."shops" to "service_role";

grant trigger on table "public"."shops" to "service_role";

grant truncate on table "public"."shops" to "service_role";

grant update on table "public"."shops" to "service_role";

create policy "Allow authenticated users to select"
on "public"."cities"
as permissive
for select
to public
using ((auth.role() = 'authenticated'::text));


create policy "insert_contractors_by_shop"
on "public"."contractors"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.shop_id = contractors.shop_id) AND (auth.uid() = profiles.id)))));


create policy "select_contractors_by_shop"
on "public"."contractors"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.shop_id = contractors.shop_id) AND (auth.uid() = profiles.id)))));


create policy "update_contractors_by_shop"
on "public"."contractors"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.shop_id = contractors.shop_id) AND (auth.uid() = profiles.id)))));


create policy "Allow users to delete their own notes"
on "public"."notes"
as permissive
for delete
to public
using ((auth.uid() = user_id));


create policy "Allow users to insert their own notes"
on "public"."notes"
as permissive
for insert
to public
with check ((auth.uid() = user_id));


create policy "Allow users to select their own notes"
on "public"."notes"
as permissive
for select
to public
using ((auth.uid() = user_id));


create policy "Allow users to update their own notes"
on "public"."notes"
as permissive
for update
to public
using ((auth.uid() = user_id))
with check ((auth.uid() = user_id));


create policy "Allow admin to manage shops"
on "public"."shops"
as permissive
for all
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role_id = 1)))))
with check ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role_id = 1)))));


create policy "Allow authenticated users to select"
on "public"."shops"
as permissive
for select
to public
using ((auth.role() = 'authenticated'::text));





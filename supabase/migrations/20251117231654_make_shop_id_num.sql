create sequence "public"."shops_code_seq";

alter table "public"."shops" add column "code" integer not null default nextval('shops_code_seq'::regclass);

CREATE UNIQUE INDEX shops_code_key ON public.shops USING btree (code);

alter table "public"."shops" add constraint "shops_code_key" UNIQUE using index "shops_code_key";



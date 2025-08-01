create extension if not exists "pgjwt" with schema "extensions";


alter table "public"."deliveries" drop column "expected_time";



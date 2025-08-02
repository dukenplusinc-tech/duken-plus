alter table "public"."deliveries" alter column "status" drop default;

alter type "public"."delivery_status" rename to "delivery_status__old_version_to_be_dropped";

create type "public"."delivery_status" as enum ('pending', 'accepted', 'due', 'canceled');

alter table "public"."deliveries" alter column status type "public"."delivery_status" using status::text::"public"."delivery_status";

alter table "public"."deliveries" alter column "status" set default 'pending'::delivery_status;

drop type "public"."delivery_status__old_version_to_be_dropped";



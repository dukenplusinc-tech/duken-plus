-- Drop the existing unique constraint on iin alone
alter table "public"."debtors" drop constraint if exists "debtors_iin_key";

-- Drop the index if it exists separately
drop index if exists "public"."debtors_iin_key";

-- Create a new unique constraint on (iin, shop_id) to allow same IIN in different shops
-- but prevent duplicate IIN in the same shop
create unique index "debtors_iin_shop_id_key" on "public"."debtors" using btree (iin, shop_id);

alter table "public"."debtors" add constraint "debtors_iin_shop_id_key" UNIQUE using index "debtors_iin_shop_id_key";

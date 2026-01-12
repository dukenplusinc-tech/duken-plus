alter table "public"."debtors" add constraint "debtors_shop_id_fkey" FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE not valid;

alter table "public"."debtors" validate constraint "debtors_shop_id_fkey";

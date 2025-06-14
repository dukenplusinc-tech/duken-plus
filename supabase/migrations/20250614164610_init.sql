create type "public"."transaction_type" as enum ('cash', 'bank_transfer');

create table "public"."cash_register" (
    "id" uuid not null default gen_random_uuid(),
    "type" transaction_type not null,
    "bank_name" text,
    "amount" numeric not null,
    "from" text,
    "date" timestamp with time zone default now(),
    "shop_id" uuid not null,
    "added_by" text,
    "created_at" date default now()
);


alter table "public"."cash_register" enable row level security;

create table "public"."chat_messages" (
    "id" uuid not null default gen_random_uuid(),
    "created_at" timestamp with time zone not null default now(),
    "content" text not null,
    "user_id" uuid,
    "shop_id" uuid not null,
    "image" text,
    "updated_at" timestamp with time zone,
    "deleted_at" timestamp with time zone,
    "reply_to" uuid
);


alter table "public"."chat_messages" enable row level security;

create table "public"."chat_reports" (
    "id" uuid not null default gen_random_uuid(),
    "chat_message_id" uuid not null,
    "user_id" uuid default auth.uid(),
    "created_at" timestamp with time zone not null default now()
);


alter table "public"."chat_reports" enable row level security;

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

create table "public"."debtor_transactions" (
    "id" uuid not null default gen_random_uuid(),
    "debtor_id" uuid,
    "transaction_type" text not null,
    "amount" numeric not null,
    "transaction_date" timestamp without time zone default now(),
    "description" text,
    "created_at" timestamp without time zone default now(),
    "added_by" text
);


alter table "public"."debtor_transactions" enable row level security;

create table "public"."debtors" (
    "id" uuid not null default gen_random_uuid(),
    "full_name" text not null,
    "iin" text not null,
    "phone" text,
    "address" text,
    "max_credit_amount" numeric not null,
    "work_place" text,
    "additional_info" text,
    "created_at" timestamp without time zone default now(),
    "updated_at" timestamp without time zone default now(),
    "shop_id" uuid not null,
    "blacklist" boolean default false,
    "balance" numeric not null default 0,
    "is_overdue" boolean not null default false
);


alter table "public"."debtors" enable row level security;

create table "public"."employee_sessions" (
    "id" uuid not null default gen_random_uuid(),
    "admin_id" uuid not null,
    "employee_id" uuid not null,
    "shop_id" uuid not null,
    "created_at" timestamp without time zone default now(),
    "expires_at" timestamp without time zone not null,
    "session_token" text not null,
    "auth_id" uuid not null
);


alter table "public"."employee_sessions" enable row level security;

create table "public"."employees" (
    "id" uuid not null default gen_random_uuid(),
    "shop_id" uuid not null,
    "full_name" text not null,
    "pin_code" character(4) not null,
    "created_at" timestamp without time zone default now(),
    "updated_at" timestamp without time zone default now()
);


alter table "public"."employees" enable row level security;

create table "public"."expenses" (
    "id" uuid not null default gen_random_uuid(),
    "shop_id" uuid not null,
    "type" text not null,
    "amount" numeric not null,
    "date" timestamp without time zone not null default now(),
    "created_at" timestamp without time zone default now()
);


alter table "public"."expenses" enable row level security;

create table "public"."file_references" (
    "id" uuid not null default gen_random_uuid(),
    "shop_id" uuid not null,
    "entity" text not null,
    "file_path" text not null,
    "uploaded_by" uuid,
    "created_at" timestamp without time zone default now(),
    "entity_type" text not null,
    "upload_id" text
);


alter table "public"."file_references" enable row level security;

create table "public"."notes" (
    "id" uuid not null default gen_random_uuid(),
    "user_id" uuid not null default auth.uid(),
    "title" text not null default ''::text,
    "content" text not null default ''::text,
    "created_at" timestamp with time zone default now(),
    "updated_at" timestamp with time zone default now()
);


alter table "public"."notes" enable row level security;

create table "public"."profiles" (
    "id" uuid not null,
    "updated_at" timestamp with time zone default now(),
    "full_name" text,
    "avatar_url" text,
    "role_id" bigint,
    "created_at" timestamp with time zone default now(),
    "language" text default 'en'::text,
    "shop_id" uuid,
    "pin_code" text default '0000'::text
);


alter table "public"."profiles" enable row level security;

create table "public"."roles" (
    "id" bigint generated by default as identity not null,
    "created_at" timestamp with time zone not null default now(),
    "role" text default 'admin'::text,
    "scope" text[] default '{}'::text[]
);


alter table "public"."roles" enable row level security;

create table "public"."shop_statistics" (
    "id" uuid not null default gen_random_uuid(),
    "total_debt" numeric not null default 0,
    "total_payments" numeric not null default 0,
    "overdue_debtors" integer not null default 0,
    "last_updated" timestamp without time zone default now(),
    "shop_id" uuid not null
);


alter table "public"."shop_statistics" enable row level security;

create table "public"."shops" (
    "id" uuid not null default gen_random_uuid(),
    "title" text not null,
    "address" text not null default ''::text,
    "city" text not null default ''::text
);


alter table "public"."shops" enable row level security;

create table "public"."subscription_payments" (
    "id" uuid not null default gen_random_uuid(),
    "shop_id" uuid not null,
    "amount" numeric not null,
    "date" timestamp without time zone not null default now(),
    "started_from" timestamp without time zone,
    "available_until" timestamp without time zone,
    "transaction_id" text not null,
    "payment_method" text not null,
    "note" text,
    "created_at" timestamp without time zone default now()
);


alter table "public"."subscription_payments" enable row level security;

create table "public"."user_action_logs" (
    "id" bigint generated by default as identity not null,
    "timestamp" timestamp with time zone not null default now(),
    "user_id" uuid,
    "action" character varying not null,
    "entity" character varying not null,
    "entity_id" character varying,
    "details" jsonb,
    "employee_id" uuid
);


alter table "public"."user_action_logs" enable row level security;

CREATE UNIQUE INDEX cash_register_pkey ON public.cash_register USING btree (id);

CREATE INDEX cash_register_shop_id_idx ON public.cash_register USING btree (shop_id);

CREATE UNIQUE INDEX chat_messages_pkey ON public.chat_messages USING btree (id);

CREATE UNIQUE INDEX chat_reports_pkey ON public.chat_reports USING btree (id);

CREATE UNIQUE INDEX cities_pkey ON public.cities USING btree (id);

CREATE UNIQUE INDEX contractors_pkey ON public.contractors USING btree (id);

CREATE UNIQUE INDEX debtor_transactions_pkey ON public.debtor_transactions USING btree (id);

CREATE UNIQUE INDEX debtors_iin_key ON public.debtors USING btree (iin);

CREATE UNIQUE INDEX debtors_pkey ON public.debtors USING btree (id);

CREATE UNIQUE INDEX employee_sessions_pkey ON public.employee_sessions USING btree (id);

CREATE UNIQUE INDEX employee_sessions_session_token_key ON public.employee_sessions USING btree (session_token);

CREATE UNIQUE INDEX employees_pkey ON public.employees USING btree (id);

CREATE UNIQUE INDEX expenses_pkey ON public.expenses USING btree (id);

CREATE UNIQUE INDEX file_references_pkey ON public.file_references USING btree (id);

CREATE INDEX idx_user_action_logs_timestamp ON public.user_action_logs USING btree ("timestamp");

CREATE INDEX idx_user_action_logs_user_id ON public.user_action_logs USING btree (user_id);

CREATE UNIQUE INDEX notes_pkey ON public.notes USING btree (id);

CREATE UNIQUE INDEX profiles_pkey ON public.profiles USING btree (id);

CREATE UNIQUE INDEX roles_pkey ON public.roles USING btree (id);

CREATE UNIQUE INDEX roles_role_key ON public.roles USING btree (role);

CREATE UNIQUE INDEX shop_statistics_pkey ON public.shop_statistics USING btree (id);

CREATE UNIQUE INDEX shops_pkey ON public.shops USING btree (id);

CREATE UNIQUE INDEX subscription_payments_pkey ON public.subscription_payments USING btree (id);

CREATE UNIQUE INDEX unique_entity_upload_id_file_path ON public.file_references USING btree (entity, upload_id, file_path);

CREATE UNIQUE INDEX unique_external_id ON public.cities USING btree (external_id);

CREATE UNIQUE INDEX user_action_logs_pkey ON public.user_action_logs USING btree (id);

alter table "public"."cash_register" add constraint "cash_register_pkey" PRIMARY KEY using index "cash_register_pkey";

alter table "public"."chat_messages" add constraint "chat_messages_pkey" PRIMARY KEY using index "chat_messages_pkey";

alter table "public"."chat_reports" add constraint "chat_reports_pkey" PRIMARY KEY using index "chat_reports_pkey";

alter table "public"."cities" add constraint "cities_pkey" PRIMARY KEY using index "cities_pkey";

alter table "public"."contractors" add constraint "contractors_pkey" PRIMARY KEY using index "contractors_pkey";

alter table "public"."debtor_transactions" add constraint "debtor_transactions_pkey" PRIMARY KEY using index "debtor_transactions_pkey";

alter table "public"."debtors" add constraint "debtors_pkey" PRIMARY KEY using index "debtors_pkey";

alter table "public"."employee_sessions" add constraint "employee_sessions_pkey" PRIMARY KEY using index "employee_sessions_pkey";

alter table "public"."employees" add constraint "employees_pkey" PRIMARY KEY using index "employees_pkey";

alter table "public"."expenses" add constraint "expenses_pkey" PRIMARY KEY using index "expenses_pkey";

alter table "public"."file_references" add constraint "file_references_pkey" PRIMARY KEY using index "file_references_pkey";

alter table "public"."notes" add constraint "notes_pkey" PRIMARY KEY using index "notes_pkey";

alter table "public"."profiles" add constraint "profiles_pkey" PRIMARY KEY using index "profiles_pkey";

alter table "public"."roles" add constraint "roles_pkey" PRIMARY KEY using index "roles_pkey";

alter table "public"."shop_statistics" add constraint "shop_statistics_pkey" PRIMARY KEY using index "shop_statistics_pkey";

alter table "public"."shops" add constraint "shops_pkey" PRIMARY KEY using index "shops_pkey";

alter table "public"."subscription_payments" add constraint "subscription_payments_pkey" PRIMARY KEY using index "subscription_payments_pkey";

alter table "public"."user_action_logs" add constraint "user_action_logs_pkey" PRIMARY KEY using index "user_action_logs_pkey";

alter table "public"."chat_messages" add constraint "chat_messages_reply_to_fkey" FOREIGN KEY (reply_to) REFERENCES chat_messages(id) not valid;

alter table "public"."chat_messages" validate constraint "chat_messages_reply_to_fkey";

alter table "public"."chat_messages" add constraint "chat_messages_shop_id_fkey" FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE not valid;

alter table "public"."chat_messages" validate constraint "chat_messages_shop_id_fkey";

alter table "public"."chat_reports" add constraint "chat_reports_chat_message_id_fkey" FOREIGN KEY (chat_message_id) REFERENCES chat_messages(id) ON DELETE CASCADE not valid;

alter table "public"."chat_reports" validate constraint "chat_reports_chat_message_id_fkey";

alter table "public"."cities" add constraint "unique_external_id" UNIQUE using index "unique_external_id";

alter table "public"."contractors" add constraint "contractors_shop_id_fkey" FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE not valid;

alter table "public"."contractors" validate constraint "contractors_shop_id_fkey";

alter table "public"."debtor_transactions" add constraint "debtor_transactions_debtor_id_fkey" FOREIGN KEY (debtor_id) REFERENCES debtors(id) ON DELETE CASCADE not valid;

alter table "public"."debtor_transactions" validate constraint "debtor_transactions_debtor_id_fkey";

alter table "public"."debtor_transactions" add constraint "debtor_transactions_transaction_type_check" CHECK ((transaction_type = ANY (ARRAY['purchase'::text, 'loan'::text]))) not valid;

alter table "public"."debtor_transactions" validate constraint "debtor_transactions_transaction_type_check";

alter table "public"."debtors" add constraint "debtors_iin_key" UNIQUE using index "debtors_iin_key";

alter table "public"."employee_sessions" add constraint "employee_sessions_admin_id_fkey" FOREIGN KEY (admin_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."employee_sessions" validate constraint "employee_sessions_admin_id_fkey";

alter table "public"."employee_sessions" add constraint "employee_sessions_auth_id_fkey" FOREIGN KEY (auth_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."employee_sessions" validate constraint "employee_sessions_auth_id_fkey";

alter table "public"."employee_sessions" add constraint "employee_sessions_employee_id_fkey" FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE not valid;

alter table "public"."employee_sessions" validate constraint "employee_sessions_employee_id_fkey";

alter table "public"."employee_sessions" add constraint "employee_sessions_session_token_key" UNIQUE using index "employee_sessions_session_token_key";

alter table "public"."employee_sessions" add constraint "employee_sessions_shop_id_fkey" FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE not valid;

alter table "public"."employee_sessions" validate constraint "employee_sessions_shop_id_fkey";

alter table "public"."employees" add constraint "employees_pin_code_check" CHECK ((pin_code ~ '^\d{4}$'::text)) not valid;

alter table "public"."employees" validate constraint "employees_pin_code_check";

alter table "public"."employees" add constraint "employees_shop_id_fkey" FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE not valid;

alter table "public"."employees" validate constraint "employees_shop_id_fkey";

alter table "public"."expenses" add constraint "expenses_shop_id_fkey" FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE not valid;

alter table "public"."expenses" validate constraint "expenses_shop_id_fkey";

alter table "public"."file_references" add constraint "file_references_shop_id_fkey" FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE not valid;

alter table "public"."file_references" validate constraint "file_references_shop_id_fkey";

alter table "public"."file_references" add constraint "file_references_uploaded_by_fkey" FOREIGN KEY (uploaded_by) REFERENCES profiles(id) not valid;

alter table "public"."file_references" validate constraint "file_references_uploaded_by_fkey";

alter table "public"."file_references" add constraint "unique_entity_upload_id_file_path" UNIQUE using index "unique_entity_upload_id_file_path";

alter table "public"."notes" add constraint "notes_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."notes" validate constraint "notes_user_id_fkey";

alter table "public"."profiles" add constraint "profiles_id_fkey" FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE not valid;

alter table "public"."profiles" validate constraint "profiles_id_fkey";

alter table "public"."profiles" add constraint "profiles_pin_code_check" CHECK ((length(pin_code) <= 4)) not valid;

alter table "public"."profiles" validate constraint "profiles_pin_code_check";

alter table "public"."profiles" add constraint "profiles_role_id_fkey" FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE SET NULL not valid;

alter table "public"."profiles" validate constraint "profiles_role_id_fkey";

alter table "public"."profiles" add constraint "profiles_shop_id_fkey" FOREIGN KEY (shop_id) REFERENCES shops(id) not valid;

alter table "public"."profiles" validate constraint "profiles_shop_id_fkey";

alter table "public"."roles" add constraint "roles_role_key" UNIQUE using index "roles_role_key";

alter table "public"."subscription_payments" add constraint "subscription_payments_shop_id_fkey" FOREIGN KEY (shop_id) REFERENCES shops(id) ON DELETE CASCADE not valid;

alter table "public"."subscription_payments" validate constraint "subscription_payments_shop_id_fkey";

alter table "public"."user_action_logs" add constraint "user_action_logs_employee_id_fkey" FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE not valid;

alter table "public"."user_action_logs" validate constraint "user_action_logs_employee_id_fkey";

alter table "public"."user_action_logs" add constraint "user_action_logs_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON UPDATE CASCADE ON DELETE CASCADE not valid;

alter table "public"."user_action_logs" validate constraint "user_action_logs_user_id_fkey";

set check_function_bodies = off;

create or replace view "public"."bank_names_view" as  SELECT DISTINCT cash_register.bank_name
   FROM cash_register
  WHERE ((cash_register.bank_name IS NOT NULL) AND (TRIM(BOTH FROM cash_register.bank_name) <> ''::text))
  ORDER BY cash_register.bank_name;


create or replace view "public"."cash_register_ui_view" as  WITH bank_sums AS (
         SELECT cash_register.shop_id,
            cash_register.bank_name,
            sum(cash_register.amount) AS amount
           FROM cash_register
          WHERE (cash_register.type = 'bank_transfer'::transaction_type)
          GROUP BY cash_register.shop_id, cash_register.bank_name
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
  GROUP BY a.shop_id;


CREATE OR REPLACE FUNCTION public.clean_old_logs()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  DELETE FROM public.user_action_logs
  WHERE timestamp < NOW() - INTERVAL '3 months';
END;
$function$
;

create or replace view "public"."debtor_statistics" as  SELECT debtors.shop_id,
    count(*) FILTER (WHERE (debtors.is_overdue = true)) AS overdue_debtors,
    sum(
        CASE
            WHEN (debtors.balance >= (0)::numeric) THEN debtors.balance
            ELSE (0)::numeric
        END) AS total_positive_balance,
    sum(
        CASE
            WHEN (debtors.balance < (0)::numeric) THEN debtors.balance
            ELSE (0)::numeric
        END) AS total_negative_balance
   FROM debtors
  WHERE (debtors.shop_id = ( SELECT profiles.shop_id
           FROM profiles
          WHERE (profiles.id = auth.uid())))
  GROUP BY debtors.shop_id;


CREATE OR REPLACE FUNCTION public.distinct_expense_types()
 RETURNS TABLE(type text)
 LANGUAGE sql
AS $function$
  select distinct type from public.expenses order by type;
$function$
;

create or replace view "public"."extended_profiles" as  SELECT p.id,
    p.full_name,
    p.avatar_url,
    p.role_id,
    p.created_at,
    p.updated_at,
    p.language,
    p.shop_id,
    u.email,
    u.phone
   FROM (profiles p
     JOIN auth.users u ON ((p.id = u.id)));


CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$function$
;

CREATE OR REPLACE FUNCTION public.log_debtor_transaction_action()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_user_id uuid;
  v_employee_id uuid;
  v_debtor_name text;
  v_debtor_balance numeric;
BEGIN
  -- Get the currently authenticated user (admin)
  v_user_id := auth.uid();

  -- Retrieve the active employee session for the current auth_id
  SELECT employee_id INTO v_employee_id
  FROM public.employee_sessions
  WHERE auth_id = v_user_id
    AND expires_at > now()
  ORDER BY created_at DESC
  LIMIT 1;

  -- Retrieve debtor name and balance at the moment of transaction
  SELECT full_name, balance INTO v_debtor_name, v_debtor_balance
  FROM public.debtors
  WHERE id = NEW.debtor_id;

  -- Log transaction
  IF (TG_OP = 'DELETE') THEN
    INSERT INTO public.user_action_logs (
      user_id, employee_id, action, entity, entity_id, details
    )
    VALUES (
      v_user_id,
      v_employee_id,
      TG_OP,
      TG_TABLE_NAME,
      OLD.id::text,
      jsonb_build_object(
        'amount', OLD.amount,
        'transaction_type', OLD.transaction_type,
        'description', OLD.description,
        'debtor_id', OLD.debtor_id,
        'debtor_name', v_debtor_name,
        'balance_at_transaction', v_debtor_balance
      )
    );
    RETURN OLD;
  ELSE
    INSERT INTO public.user_action_logs (
      user_id, employee_id, action, entity, entity_id, details
    )
    VALUES (
      v_user_id,
      v_employee_id,
      TG_OP,
      TG_TABLE_NAME,
      NEW.id::text,
      jsonb_build_object(
        'amount', NEW.amount,
        'transaction_type', NEW.transaction_type,
        'description', NEW.description,
        'debtor_id', NEW.debtor_id,
        'debtor_name', v_debtor_name,
        'balance_at_transaction', v_debtor_balance
      )
    );
    RETURN NEW;
  END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.log_employee_action()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  INSERT INTO public.user_action_logs (user_id, employee_id, action, entity, entity_id, details)
  VALUES (
    NULL, -- No user_id since this action is for employees
    NEW.id,
    TG_OP,
    TG_TABLE_NAME,
    NEW.id::text,
    row_to_json(NEW)::jsonb
  );

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.log_user_action()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
DECLARE
  v_user_id uuid;
  v_employee_id uuid;
BEGIN
  -- Get the currently authenticated user
  v_user_id := auth.uid();

  -- Retrieve the active employee session for the current auth_id
  SELECT employee_id INTO v_employee_id
  FROM public.employee_sessions
  WHERE auth_id = v_user_id
    AND expires_at > now() -- Only consider active sessions
  ORDER BY created_at DESC -- Get the most recent session
  LIMIT 1;

  IF (TG_OP = 'DELETE') THEN
    INSERT INTO public.user_action_logs (
      user_id, employee_id, action, entity, entity_id, details
    )
    VALUES (
      v_user_id, -- The authenticated user performing the action
      v_employee_id, -- The employee they are acting as
      TG_OP,
      TG_TABLE_NAME,
      OLD.id::text,
      row_to_json(OLD)::jsonb
    );
    RETURN OLD;
  ELSE
    INSERT INTO public.user_action_logs (
      user_id, employee_id, action, entity, entity_id, details
    )
    VALUES (
      v_user_id, -- The authenticated user performing the action
      v_employee_id, -- The employee they are acting as
      TG_OP,
      TG_TABLE_NAME,
      NEW.id::text,
      row_to_json(NEW)::jsonb
    );
    RETURN NEW;
  END IF;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.recalculate_is_overdue(debtor_id uuid)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
  overdue_start_date TIMESTAMP;
BEGIN
  -- Find the earliest date when the debtor's balance became negative
  SELECT MIN(transaction_date)
  INTO overdue_start_date
  FROM debtor_transactions
  WHERE debtor_transactions.debtor_id = recalculate_is_overdue.debtor_id
    AND (
      SELECT balance
      FROM debtors
      WHERE id = recalculate_is_overdue.debtor_id
    ) < 0;

  -- Update is_overdue to true if negative balance has persisted for 1 month or more
  UPDATE debtors
  SET is_overdue = (
    overdue_start_date IS NOT NULL
    AND overdue_start_date < NOW() - INTERVAL '1 month'
  )
  WHERE debtors.id = recalculate_is_overdue.debtor_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_debtor_balance()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Recalculate balance
  UPDATE debtors
  SET balance = (
    SELECT COALESCE(SUM(
      CASE
        WHEN transaction_type = 'purchase' THEN amount
        WHEN transaction_type = 'loan' THEN -amount
      END
    ), 0)
    FROM debtor_transactions
    WHERE debtor_id = NEW.debtor_id
  )
  WHERE id = NEW.debtor_id;

  -- Recalculate is_overdue
  PERFORM recalculate_is_overdue(NEW.debtor_id);

  RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_debtor_balance(debtor_id uuid, new_balance numeric)
 RETURNS void
 LANGUAGE plpgsql
 SET search_path TO 'public', 'extensions', 'auth'
AS $function$
BEGIN
    UPDATE public.debtors
    SET balance = new_balance,
        updated_at = now()
    WHERE id = debtor_id;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_debtor_balance_after_delete()
 RETURNS trigger
 LANGUAGE plpgsql
AS $function$
BEGIN
  -- Recalculate balance
  UPDATE debtors
  SET balance = (
    SELECT COALESCE(SUM(
      CASE
        WHEN transaction_type = 'purchase' THEN amount
        WHEN transaction_type = 'payment' THEN -amount
      END
    ), 0)
    FROM debtor_transactions
    WHERE debtor_id = OLD.debtor_id
  )
  WHERE id = OLD.debtor_id;

  -- Recalculate is_overdue
  PERFORM recalculate_is_overdue(OLD.debtor_id);

  RETURN OLD;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.update_payment_and_subscription(shop_uuid uuid, amount numeric, payment_method text, transaction_id text)
 RETURNS void
 LANGUAGE plpgsql
AS $function$
DECLARE
    last_payment_date timestamp;
    paid_until_date timestamp;
BEGIN
    -- Insert the payment record
    INSERT INTO "public"."payments"("shop_id", "payment_date", "amount", "payment_method", "transaction_id")
    VALUES (shop_uuid, now(), amount, payment_method, transaction_id);

    -- Update the shop's subscription information
    SELECT "last_payment_date" INTO last_payment_date
    FROM "public"."shops"
    WHERE "id" = shop_uuid;

    -- Calculate the new paid_until date
    IF last_payment_date IS NULL THEN
        paid_until_date := now() + INTERVAL '1 month';  -- Start from today if no previous payment
    ELSE
        paid_until_date := last_payment_date + INTERVAL '1 month';  -- Add one month to the last payment date
    END IF;

    -- Update the shop's subscription status
    UPDATE "public"."shops"
    SET "last_payment_date" = now(),
        "paid_until" = paid_until_date,
        "is_paid" = true
    WHERE "id" = shop_uuid;
END;
$function$
;

grant delete on table "public"."cash_register" to "anon";

grant insert on table "public"."cash_register" to "anon";

grant references on table "public"."cash_register" to "anon";

grant select on table "public"."cash_register" to "anon";

grant trigger on table "public"."cash_register" to "anon";

grant truncate on table "public"."cash_register" to "anon";

grant update on table "public"."cash_register" to "anon";

grant delete on table "public"."cash_register" to "authenticated";

grant insert on table "public"."cash_register" to "authenticated";

grant references on table "public"."cash_register" to "authenticated";

grant select on table "public"."cash_register" to "authenticated";

grant trigger on table "public"."cash_register" to "authenticated";

grant truncate on table "public"."cash_register" to "authenticated";

grant update on table "public"."cash_register" to "authenticated";

grant delete on table "public"."cash_register" to "service_role";

grant insert on table "public"."cash_register" to "service_role";

grant references on table "public"."cash_register" to "service_role";

grant select on table "public"."cash_register" to "service_role";

grant trigger on table "public"."cash_register" to "service_role";

grant truncate on table "public"."cash_register" to "service_role";

grant update on table "public"."cash_register" to "service_role";

grant delete on table "public"."chat_messages" to "anon";

grant insert on table "public"."chat_messages" to "anon";

grant references on table "public"."chat_messages" to "anon";

grant select on table "public"."chat_messages" to "anon";

grant trigger on table "public"."chat_messages" to "anon";

grant truncate on table "public"."chat_messages" to "anon";

grant update on table "public"."chat_messages" to "anon";

grant delete on table "public"."chat_messages" to "authenticated";

grant insert on table "public"."chat_messages" to "authenticated";

grant references on table "public"."chat_messages" to "authenticated";

grant select on table "public"."chat_messages" to "authenticated";

grant trigger on table "public"."chat_messages" to "authenticated";

grant truncate on table "public"."chat_messages" to "authenticated";

grant update on table "public"."chat_messages" to "authenticated";

grant delete on table "public"."chat_messages" to "service_role";

grant insert on table "public"."chat_messages" to "service_role";

grant references on table "public"."chat_messages" to "service_role";

grant select on table "public"."chat_messages" to "service_role";

grant trigger on table "public"."chat_messages" to "service_role";

grant truncate on table "public"."chat_messages" to "service_role";

grant update on table "public"."chat_messages" to "service_role";

grant delete on table "public"."chat_reports" to "anon";

grant insert on table "public"."chat_reports" to "anon";

grant references on table "public"."chat_reports" to "anon";

grant select on table "public"."chat_reports" to "anon";

grant trigger on table "public"."chat_reports" to "anon";

grant truncate on table "public"."chat_reports" to "anon";

grant update on table "public"."chat_reports" to "anon";

grant delete on table "public"."chat_reports" to "authenticated";

grant insert on table "public"."chat_reports" to "authenticated";

grant references on table "public"."chat_reports" to "authenticated";

grant select on table "public"."chat_reports" to "authenticated";

grant trigger on table "public"."chat_reports" to "authenticated";

grant truncate on table "public"."chat_reports" to "authenticated";

grant update on table "public"."chat_reports" to "authenticated";

grant delete on table "public"."chat_reports" to "service_role";

grant insert on table "public"."chat_reports" to "service_role";

grant references on table "public"."chat_reports" to "service_role";

grant select on table "public"."chat_reports" to "service_role";

grant trigger on table "public"."chat_reports" to "service_role";

grant truncate on table "public"."chat_reports" to "service_role";

grant update on table "public"."chat_reports" to "service_role";

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

grant delete on table "public"."debtor_transactions" to "anon";

grant insert on table "public"."debtor_transactions" to "anon";

grant references on table "public"."debtor_transactions" to "anon";

grant select on table "public"."debtor_transactions" to "anon";

grant trigger on table "public"."debtor_transactions" to "anon";

grant truncate on table "public"."debtor_transactions" to "anon";

grant update on table "public"."debtor_transactions" to "anon";

grant delete on table "public"."debtor_transactions" to "authenticated";

grant insert on table "public"."debtor_transactions" to "authenticated";

grant references on table "public"."debtor_transactions" to "authenticated";

grant select on table "public"."debtor_transactions" to "authenticated";

grant trigger on table "public"."debtor_transactions" to "authenticated";

grant truncate on table "public"."debtor_transactions" to "authenticated";

grant update on table "public"."debtor_transactions" to "authenticated";

grant delete on table "public"."debtor_transactions" to "service_role";

grant insert on table "public"."debtor_transactions" to "service_role";

grant references on table "public"."debtor_transactions" to "service_role";

grant select on table "public"."debtor_transactions" to "service_role";

grant trigger on table "public"."debtor_transactions" to "service_role";

grant truncate on table "public"."debtor_transactions" to "service_role";

grant update on table "public"."debtor_transactions" to "service_role";

grant delete on table "public"."debtors" to "anon";

grant insert on table "public"."debtors" to "anon";

grant references on table "public"."debtors" to "anon";

grant select on table "public"."debtors" to "anon";

grant trigger on table "public"."debtors" to "anon";

grant truncate on table "public"."debtors" to "anon";

grant update on table "public"."debtors" to "anon";

grant delete on table "public"."debtors" to "authenticated";

grant insert on table "public"."debtors" to "authenticated";

grant references on table "public"."debtors" to "authenticated";

grant select on table "public"."debtors" to "authenticated";

grant trigger on table "public"."debtors" to "authenticated";

grant truncate on table "public"."debtors" to "authenticated";

grant update on table "public"."debtors" to "authenticated";

grant delete on table "public"."debtors" to "service_role";

grant insert on table "public"."debtors" to "service_role";

grant references on table "public"."debtors" to "service_role";

grant select on table "public"."debtors" to "service_role";

grant trigger on table "public"."debtors" to "service_role";

grant truncate on table "public"."debtors" to "service_role";

grant update on table "public"."debtors" to "service_role";

grant delete on table "public"."employee_sessions" to "anon";

grant insert on table "public"."employee_sessions" to "anon";

grant references on table "public"."employee_sessions" to "anon";

grant select on table "public"."employee_sessions" to "anon";

grant trigger on table "public"."employee_sessions" to "anon";

grant truncate on table "public"."employee_sessions" to "anon";

grant update on table "public"."employee_sessions" to "anon";

grant delete on table "public"."employee_sessions" to "authenticated";

grant insert on table "public"."employee_sessions" to "authenticated";

grant references on table "public"."employee_sessions" to "authenticated";

grant select on table "public"."employee_sessions" to "authenticated";

grant trigger on table "public"."employee_sessions" to "authenticated";

grant truncate on table "public"."employee_sessions" to "authenticated";

grant update on table "public"."employee_sessions" to "authenticated";

grant delete on table "public"."employee_sessions" to "service_role";

grant insert on table "public"."employee_sessions" to "service_role";

grant references on table "public"."employee_sessions" to "service_role";

grant select on table "public"."employee_sessions" to "service_role";

grant trigger on table "public"."employee_sessions" to "service_role";

grant truncate on table "public"."employee_sessions" to "service_role";

grant update on table "public"."employee_sessions" to "service_role";

grant delete on table "public"."employees" to "anon";

grant insert on table "public"."employees" to "anon";

grant references on table "public"."employees" to "anon";

grant select on table "public"."employees" to "anon";

grant trigger on table "public"."employees" to "anon";

grant truncate on table "public"."employees" to "anon";

grant update on table "public"."employees" to "anon";

grant delete on table "public"."employees" to "authenticated";

grant insert on table "public"."employees" to "authenticated";

grant references on table "public"."employees" to "authenticated";

grant select on table "public"."employees" to "authenticated";

grant trigger on table "public"."employees" to "authenticated";

grant truncate on table "public"."employees" to "authenticated";

grant update on table "public"."employees" to "authenticated";

grant delete on table "public"."employees" to "service_role";

grant insert on table "public"."employees" to "service_role";

grant references on table "public"."employees" to "service_role";

grant select on table "public"."employees" to "service_role";

grant trigger on table "public"."employees" to "service_role";

grant truncate on table "public"."employees" to "service_role";

grant update on table "public"."employees" to "service_role";

grant delete on table "public"."expenses" to "anon";

grant insert on table "public"."expenses" to "anon";

grant references on table "public"."expenses" to "anon";

grant select on table "public"."expenses" to "anon";

grant trigger on table "public"."expenses" to "anon";

grant truncate on table "public"."expenses" to "anon";

grant update on table "public"."expenses" to "anon";

grant delete on table "public"."expenses" to "authenticated";

grant insert on table "public"."expenses" to "authenticated";

grant references on table "public"."expenses" to "authenticated";

grant select on table "public"."expenses" to "authenticated";

grant trigger on table "public"."expenses" to "authenticated";

grant truncate on table "public"."expenses" to "authenticated";

grant update on table "public"."expenses" to "authenticated";

grant delete on table "public"."expenses" to "service_role";

grant insert on table "public"."expenses" to "service_role";

grant references on table "public"."expenses" to "service_role";

grant select on table "public"."expenses" to "service_role";

grant trigger on table "public"."expenses" to "service_role";

grant truncate on table "public"."expenses" to "service_role";

grant update on table "public"."expenses" to "service_role";

grant delete on table "public"."file_references" to "anon";

grant insert on table "public"."file_references" to "anon";

grant references on table "public"."file_references" to "anon";

grant select on table "public"."file_references" to "anon";

grant trigger on table "public"."file_references" to "anon";

grant truncate on table "public"."file_references" to "anon";

grant update on table "public"."file_references" to "anon";

grant delete on table "public"."file_references" to "authenticated";

grant insert on table "public"."file_references" to "authenticated";

grant references on table "public"."file_references" to "authenticated";

grant select on table "public"."file_references" to "authenticated";

grant trigger on table "public"."file_references" to "authenticated";

grant truncate on table "public"."file_references" to "authenticated";

grant update on table "public"."file_references" to "authenticated";

grant delete on table "public"."file_references" to "service_role";

grant insert on table "public"."file_references" to "service_role";

grant references on table "public"."file_references" to "service_role";

grant select on table "public"."file_references" to "service_role";

grant trigger on table "public"."file_references" to "service_role";

grant truncate on table "public"."file_references" to "service_role";

grant update on table "public"."file_references" to "service_role";

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

grant delete on table "public"."profiles" to "anon";

grant insert on table "public"."profiles" to "anon";

grant references on table "public"."profiles" to "anon";

grant select on table "public"."profiles" to "anon";

grant trigger on table "public"."profiles" to "anon";

grant truncate on table "public"."profiles" to "anon";

grant update on table "public"."profiles" to "anon";

grant delete on table "public"."profiles" to "authenticated";

grant insert on table "public"."profiles" to "authenticated";

grant references on table "public"."profiles" to "authenticated";

grant select on table "public"."profiles" to "authenticated";

grant trigger on table "public"."profiles" to "authenticated";

grant truncate on table "public"."profiles" to "authenticated";

grant update on table "public"."profiles" to "authenticated";

grant delete on table "public"."profiles" to "service_role";

grant insert on table "public"."profiles" to "service_role";

grant references on table "public"."profiles" to "service_role";

grant select on table "public"."profiles" to "service_role";

grant trigger on table "public"."profiles" to "service_role";

grant truncate on table "public"."profiles" to "service_role";

grant update on table "public"."profiles" to "service_role";

grant delete on table "public"."roles" to "anon";

grant insert on table "public"."roles" to "anon";

grant references on table "public"."roles" to "anon";

grant select on table "public"."roles" to "anon";

grant trigger on table "public"."roles" to "anon";

grant truncate on table "public"."roles" to "anon";

grant update on table "public"."roles" to "anon";

grant delete on table "public"."roles" to "authenticated";

grant insert on table "public"."roles" to "authenticated";

grant references on table "public"."roles" to "authenticated";

grant select on table "public"."roles" to "authenticated";

grant trigger on table "public"."roles" to "authenticated";

grant truncate on table "public"."roles" to "authenticated";

grant update on table "public"."roles" to "authenticated";

grant delete on table "public"."roles" to "service_role";

grant insert on table "public"."roles" to "service_role";

grant references on table "public"."roles" to "service_role";

grant select on table "public"."roles" to "service_role";

grant trigger on table "public"."roles" to "service_role";

grant truncate on table "public"."roles" to "service_role";

grant update on table "public"."roles" to "service_role";

grant delete on table "public"."shop_statistics" to "anon";

grant insert on table "public"."shop_statistics" to "anon";

grant references on table "public"."shop_statistics" to "anon";

grant select on table "public"."shop_statistics" to "anon";

grant trigger on table "public"."shop_statistics" to "anon";

grant truncate on table "public"."shop_statistics" to "anon";

grant update on table "public"."shop_statistics" to "anon";

grant delete on table "public"."shop_statistics" to "authenticated";

grant insert on table "public"."shop_statistics" to "authenticated";

grant references on table "public"."shop_statistics" to "authenticated";

grant select on table "public"."shop_statistics" to "authenticated";

grant trigger on table "public"."shop_statistics" to "authenticated";

grant truncate on table "public"."shop_statistics" to "authenticated";

grant update on table "public"."shop_statistics" to "authenticated";

grant delete on table "public"."shop_statistics" to "service_role";

grant insert on table "public"."shop_statistics" to "service_role";

grant references on table "public"."shop_statistics" to "service_role";

grant select on table "public"."shop_statistics" to "service_role";

grant trigger on table "public"."shop_statistics" to "service_role";

grant truncate on table "public"."shop_statistics" to "service_role";

grant update on table "public"."shop_statistics" to "service_role";

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

grant delete on table "public"."subscription_payments" to "anon";

grant insert on table "public"."subscription_payments" to "anon";

grant references on table "public"."subscription_payments" to "anon";

grant select on table "public"."subscription_payments" to "anon";

grant trigger on table "public"."subscription_payments" to "anon";

grant truncate on table "public"."subscription_payments" to "anon";

grant update on table "public"."subscription_payments" to "anon";

grant delete on table "public"."subscription_payments" to "authenticated";

grant insert on table "public"."subscription_payments" to "authenticated";

grant references on table "public"."subscription_payments" to "authenticated";

grant select on table "public"."subscription_payments" to "authenticated";

grant trigger on table "public"."subscription_payments" to "authenticated";

grant truncate on table "public"."subscription_payments" to "authenticated";

grant update on table "public"."subscription_payments" to "authenticated";

grant delete on table "public"."subscription_payments" to "service_role";

grant insert on table "public"."subscription_payments" to "service_role";

grant references on table "public"."subscription_payments" to "service_role";

grant select on table "public"."subscription_payments" to "service_role";

grant trigger on table "public"."subscription_payments" to "service_role";

grant truncate on table "public"."subscription_payments" to "service_role";

grant update on table "public"."subscription_payments" to "service_role";

grant delete on table "public"."user_action_logs" to "anon";

grant insert on table "public"."user_action_logs" to "anon";

grant references on table "public"."user_action_logs" to "anon";

grant select on table "public"."user_action_logs" to "anon";

grant trigger on table "public"."user_action_logs" to "anon";

grant truncate on table "public"."user_action_logs" to "anon";

grant update on table "public"."user_action_logs" to "anon";

grant delete on table "public"."user_action_logs" to "authenticated";

grant insert on table "public"."user_action_logs" to "authenticated";

grant references on table "public"."user_action_logs" to "authenticated";

grant select on table "public"."user_action_logs" to "authenticated";

grant trigger on table "public"."user_action_logs" to "authenticated";

grant truncate on table "public"."user_action_logs" to "authenticated";

grant update on table "public"."user_action_logs" to "authenticated";

grant delete on table "public"."user_action_logs" to "service_role";

grant insert on table "public"."user_action_logs" to "service_role";

grant references on table "public"."user_action_logs" to "service_role";

grant select on table "public"."user_action_logs" to "service_role";

grant trigger on table "public"."user_action_logs" to "service_role";

grant truncate on table "public"."user_action_logs" to "service_role";

grant update on table "public"."user_action_logs" to "service_role";

create policy "delete_cash_register_for_shop"
on "public"."cash_register"
as permissive
for delete
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "insert_cash_register_for_shop"
on "public"."cash_register"
as permissive
for insert
to public
with check ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "select_cash_register_by_shop"
on "public"."cash_register"
as permissive
for select
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "update_cash_register_for_shop"
on "public"."cash_register"
as permissive
for update
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Allow delete own chat messages"
on "public"."chat_messages"
as permissive
for delete
to public
using ((user_id = auth.uid()));


create policy "Allow insert"
on "public"."chat_messages"
as permissive
for insert
to authenticated
with check (true);


create policy "Allow read in city"
on "public"."chat_messages"
as permissive
for select
to public
using ((shop_id IN ( SELECT shops.id
   FROM shops
  WHERE (shops.city = ( SELECT shops_1.city
           FROM shops shops_1
          WHERE (shops_1.id = ( SELECT profiles.shop_id
                   FROM profiles
                  WHERE (profiles.id = auth.uid()))))))));


create policy "Allow update own chat messages"
on "public"."chat_messages"
as permissive
for update
to public
using ((user_id = auth.uid()));


create policy "Allow insert"
on "public"."chat_reports"
as permissive
for insert
to authenticated
with check (true);


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


create policy "Allow delete for debtor transactions"
on "public"."debtor_transactions"
as permissive
for delete
to public
using ((debtor_id IN ( SELECT debtors.id
   FROM debtors
  WHERE (debtors.shop_id = ( SELECT profiles.shop_id
           FROM profiles
          WHERE (profiles.id = auth.uid()))))));


create policy "Allow insert for debtor transactions"
on "public"."debtor_transactions"
as permissive
for insert
to public
with check ((debtor_id IN ( SELECT debtors.id
   FROM debtors
  WHERE (debtors.shop_id = ( SELECT profiles.shop_id
           FROM profiles
          WHERE (profiles.id = auth.uid()))))));


create policy "Allow update for debtor transactions"
on "public"."debtor_transactions"
as permissive
for update
to public
using ((debtor_id IN ( SELECT debtors.id
   FROM debtors
  WHERE (debtors.shop_id = ( SELECT profiles.shop_id
           FROM profiles
          WHERE (profiles.id = auth.uid()))))));


create policy "Allow view for debtor transactions"
on "public"."debtor_transactions"
as permissive
for select
to public
using ((debtor_id IN ( SELECT debtors.id
   FROM debtors
  WHERE (debtors.shop_id = ( SELECT profiles.shop_id
           FROM profiles
          WHERE (profiles.id = auth.uid()))))));


create policy "Allow delete for shop users"
on "public"."debtors"
as permissive
for delete
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Allow insert for shop users"
on "public"."debtors"
as permissive
for insert
to public
with check ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Allow update for shop users"
on "public"."debtors"
as permissive
for update
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))))
with check ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Allow view for shop users"
on "public"."debtors"
as permissive
for select
to public
using (((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))) OR ((blacklist = true) AND (( SELECT shops.city
   FROM shops
  WHERE (shops.id = debtors.shop_id)) = ( SELECT shops.city
   FROM (shops
     JOIN profiles ON ((profiles.shop_id = shops.id)))
  WHERE (profiles.id = auth.uid()))))));


create policy "Admins can create employee sessions"
on "public"."employee_sessions"
as permissive
for insert
to public
with check ((auth.uid() = admin_id));


create policy "Admins can delete their employee sessions"
on "public"."employee_sessions"
as permissive
for delete
to public
using ((auth.uid() = admin_id));


create policy "Admins can update their employee sessions"
on "public"."employee_sessions"
as permissive
for update
to public
using ((auth.uid() = admin_id));


create policy "Admins can view their employee sessions"
on "public"."employee_sessions"
as permissive
for select
to public
using ((auth.uid() = admin_id));


create policy "Employees can view their own session"
on "public"."employee_sessions"
as permissive
for select
to public
using ((auth.uid() = employee_id));


create policy "Allow access to employees of the same shop"
on "public"."employees"
as permissive
for select
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Allow deletion of employees by the same shop's admin"
on "public"."employees"
as permissive
for delete
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Allow insertion of employees by the same shop's admin"
on "public"."employees"
as permissive
for insert
to public
with check ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Allow updates to employees by the same shop's admin"
on "public"."employees"
as permissive
for update
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))))
with check ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Allow shop members to delete expenses"
on "public"."expenses"
as permissive
for delete
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Allow shop members to insert expenses"
on "public"."expenses"
as permissive
for insert
to public
with check ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Allow shop members to read expenses"
on "public"."expenses"
as permissive
for select
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Allow shop members to update expenses"
on "public"."expenses"
as permissive
for update
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))))
with check ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Allow delete for users with shop access"
on "public"."file_references"
as permissive
for delete
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Allow insert for users with shop access"
on "public"."file_references"
as permissive
for insert
to public
with check ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Allow update for users with shop access"
on "public"."file_references"
as permissive
for update
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Allow view for users with shop access"
on "public"."file_references"
as permissive
for select
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


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


create policy "Allow admin to delete"
on "public"."profiles"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = auth.uid()) AND (p.role_id = 1)))));


create policy "Allow profile creation for users with users scope"
on "public"."profiles"
as permissive
for insert
to public
with check ((EXISTS ( SELECT 1
   FROM (roles
     JOIN profiles profiles_1 ON ((profiles_1.role_id = roles.id)))
  WHERE ((profiles_1.id = auth.uid()) AND ('users'::text = ANY (roles.scope))))));


create policy "Allow users to insert their own profile"
on "public"."profiles"
as permissive
for insert
to authenticated
with check ((( SELECT auth.uid() AS uid) = id));


create policy "Allow users to select their own profile"
on "public"."profiles"
as permissive
for select
to authenticated
using ((( SELECT auth.uid() AS uid) = id));


create policy "Allow users to update their own profile"
on "public"."profiles"
as permissive
for update
to authenticated
using ((( SELECT auth.uid() AS uid) = id))
with check ((( SELECT auth.uid() AS uid) = id));


create policy "Public profiles are viewable by everyone."
on "public"."profiles"
as permissive
for select
to public
using (true);


create policy "Users can update own profile."
on "public"."profiles"
as permissive
for update
to public
using ((auth.uid() = id));


create policy "Allow authenticated read access"
on "public"."roles"
as permissive
for select
to public
using ((auth.uid() IS NOT NULL));


create policy "Allow delete for shop users"
on "public"."shop_statistics"
as permissive
for delete
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Allow insert for shop users"
on "public"."shop_statistics"
as permissive
for insert
to public
with check ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Allow update for shop users"
on "public"."shop_statistics"
as permissive
for update
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Allow view for shop users"
on "public"."shop_statistics"
as permissive
for select
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


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


create policy "select_subscription_payments_by_shop"
on "public"."subscription_payments"
as permissive
for select
to public
using ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = auth.uid()))));


create policy "Allow admin to delete"
on "public"."user_action_logs"
as permissive
for delete
to public
using ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = auth.uid()) AND (profiles.role_id = 1)))));


create policy "Allow authenticated users to insert"
on "public"."user_action_logs"
as permissive
for insert
to public
with check ((auth.role() = 'authenticated'::text));


create policy "Allow authenticated users to select"
on "public"."user_action_logs"
as permissive
for select
to public
using ((auth.role() = 'authenticated'::text));


CREATE TRIGGER log_debtor_transaction_delete AFTER DELETE ON public.debtor_transactions FOR EACH ROW EXECUTE FUNCTION log_debtor_transaction_action();

CREATE TRIGGER log_debtor_transaction_insert AFTER INSERT ON public.debtor_transactions FOR EACH ROW EXECUTE FUNCTION log_debtor_transaction_action();

CREATE TRIGGER log_debtor_transaction_update AFTER UPDATE ON public.debtor_transactions FOR EACH ROW EXECUTE FUNCTION log_debtor_transaction_action();

CREATE TRIGGER recalculate_balance_after_delete AFTER DELETE ON public.debtor_transactions FOR EACH ROW EXECUTE FUNCTION update_debtor_balance_after_delete();

CREATE TRIGGER recalculate_balance_after_insert AFTER INSERT ON public.debtor_transactions FOR EACH ROW EXECUTE FUNCTION update_debtor_balance();

CREATE TRIGGER recalculate_balance_after_update AFTER UPDATE ON public.debtor_transactions FOR EACH ROW EXECUTE FUNCTION update_debtor_balance();

CREATE TRIGGER recalculate_balance_on_delete AFTER DELETE ON public.debtor_transactions FOR EACH ROW EXECUTE FUNCTION update_debtor_balance_after_delete();

CREATE TRIGGER debtors_action_log AFTER INSERT OR DELETE OR UPDATE ON public.debtors FOR EACH ROW EXECUTE FUNCTION log_user_action();

CREATE TRIGGER log_employee_action_trigger AFTER INSERT OR DELETE OR UPDATE ON public.employees FOR EACH ROW EXECUTE FUNCTION log_employee_action();

CREATE TRIGGER profile_action_log AFTER INSERT OR DELETE OR UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION log_user_action();



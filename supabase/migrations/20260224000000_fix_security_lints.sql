-- Fix Supabase security advisor lints
-- 1. Function Search Path Mutable — set fixed search_path on all affected functions
-- 2. RLS Policy Always True — tighten INSERT policies on chat_messages and chat_reports
-- NOTE: "Leaked Password Protection" must be enabled manually in the Supabase dashboard
--       under Authentication → Settings → Password Security.

-- ============================================================
-- 1. Fix mutable search_path on all public functions
-- ============================================================

ALTER FUNCTION public.recalculate_is_overdue(uuid)               SET search_path = public;
ALTER FUNCTION public.add_shift_cash_register(transaction_type, numeric, text, text) SET search_path = public;
ALTER FUNCTION public.attach_entry_to_shift(uuid)                SET search_path = public;
ALTER FUNCTION public.clean_old_logs()                           SET search_path = public;
ALTER FUNCTION public.distinct_expense_types()                   SET search_path = public;
ALTER FUNCTION public.update_payment_and_subscription(uuid, numeric, text, text) SET search_path = public;
ALTER FUNCTION public.mark_overdue_deliveries()                  SET search_path = public;
ALTER FUNCTION public.current_shop_id()                          SET search_path = public;
ALTER FUNCTION public.log_debtor_transaction_action()            SET search_path = public;
ALTER FUNCTION public.log_employee_action()                      SET search_path = public;
ALTER FUNCTION public.log_user_action()                          SET search_path = public;
ALTER FUNCTION public.update_debtor_balance()                    SET search_path = public;
ALTER FUNCTION public.auto_close_cash_shifts()                   SET search_path = public;
ALTER FUNCTION public.close_cash_shift(uuid, numeric, text, jsonb) SET search_path = public;
ALTER FUNCTION public.create_shop_from_user_metadata()           SET search_path = public;
ALTER FUNCTION public.get_or_create_open_shift(text)             SET search_path = public;
ALTER FUNCTION public.handle_new_user()                          SET search_path = public;

-- ============================================================
-- 2. Tighten overly-permissive INSERT policies
-- ============================================================

-- chat_messages: only allow a user to insert a message attributed to themselves
DROP POLICY IF EXISTS "Allow insert" ON "public"."chat_messages";
CREATE POLICY "Allow insert"
ON "public"."chat_messages"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

-- chat_reports: only allow a user to insert a report attributed to themselves
DROP POLICY IF EXISTS "Allow insert" ON "public"."chat_reports";
CREATE POLICY "Allow insert"
ON "public"."chat_reports"
AS PERMISSIVE
FOR INSERT
TO authenticated
WITH CHECK (user_id = (SELECT auth.uid()));

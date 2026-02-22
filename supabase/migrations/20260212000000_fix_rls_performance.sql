-- Fix RLS performance issues flagged by Supabase linter:
-- 1. auth_rls_initplan: wrap auth.uid()/auth.role() with (select ...) to avoid per-row re-evaluation
-- 2. multiple_permissive_policies: consolidate duplicate policies on same table/role/action

-- ============================================================
-- TABLE: cash_register
-- Fix: wrap auth.uid() with (select auth.uid())
-- ============================================================

DROP POLICY IF EXISTS "delete_cash_register_for_shop" ON "public"."cash_register";
CREATE POLICY "delete_cash_register_for_shop"
ON "public"."cash_register"
AS permissive
FOR DELETE
TO public
USING ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

DROP POLICY IF EXISTS "insert_cash_register_for_shop" ON "public"."cash_register";
CREATE POLICY "insert_cash_register_for_shop"
ON "public"."cash_register"
AS permissive
FOR INSERT
TO public
WITH CHECK ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

DROP POLICY IF EXISTS "select_cash_register_by_shop" ON "public"."cash_register";
CREATE POLICY "select_cash_register_by_shop"
ON "public"."cash_register"
AS permissive
FOR SELECT
TO public
USING ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

DROP POLICY IF EXISTS "update_cash_register_for_shop" ON "public"."cash_register";
CREATE POLICY "update_cash_register_for_shop"
ON "public"."cash_register"
AS permissive
FOR UPDATE
TO public
USING ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

-- ============================================================
-- TABLE: chat_messages
-- Fix: wrap auth.uid() with (select auth.uid())
-- ============================================================

DROP POLICY IF EXISTS "Allow delete own chat messages" ON "public"."chat_messages";
CREATE POLICY "Allow delete own chat messages"
ON "public"."chat_messages"
AS permissive
FOR DELETE
TO public
USING ((user_id = (select auth.uid())));

DROP POLICY IF EXISTS "Allow read in city" ON "public"."chat_messages";
CREATE POLICY "Allow read in city"
ON "public"."chat_messages"
AS permissive
FOR SELECT
TO public
USING ((shop_id IN ( SELECT shops.id
   FROM shops
  WHERE (shops.city = ( SELECT shops_1.city
           FROM shops shops_1
          WHERE (shops_1.id = ( SELECT profiles.shop_id
                   FROM profiles
                  WHERE (profiles.id = (select auth.uid())))))))));

DROP POLICY IF EXISTS "Allow update own chat messages" ON "public"."chat_messages";
CREATE POLICY "Allow update own chat messages"
ON "public"."chat_messages"
AS permissive
FOR UPDATE
TO public
USING ((user_id = (select auth.uid())));

-- ============================================================
-- TABLE: cities
-- Fix: consolidate 2 SELECT policies into 1 open policy
-- Both anon and authenticated need to read cities
-- ============================================================

DROP POLICY IF EXISTS "Allow authenticated users to select" ON "public"."cities";
DROP POLICY IF EXISTS "Allow anonymous users to select cities" ON "public"."cities";
CREATE POLICY "Allow all users to select cities"
ON "public"."cities"
AS permissive
FOR SELECT
TO public
USING (true);

-- ============================================================
-- TABLE: contractors
-- Fix: 3 identical FOR ALL policies -> 1 policy with (select auth.uid())
-- ============================================================

DROP POLICY IF EXISTS "insert_contractors_by_shop" ON "public"."contractors";
DROP POLICY IF EXISTS "select_contractors_by_shop" ON "public"."contractors";
DROP POLICY IF EXISTS "update_contractors_by_shop" ON "public"."contractors";
CREATE POLICY "manage_contractors_by_shop"
ON "public"."contractors"
AS permissive
FOR ALL
TO public
USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.shop_id = contractors.shop_id) AND ((select auth.uid()) = profiles.id)))));

-- ============================================================
-- TABLE: debtor_transactions
-- Fix: wrap auth.uid() with (select auth.uid())
-- ============================================================

DROP POLICY IF EXISTS "Allow delete for debtor transactions" ON "public"."debtor_transactions";
CREATE POLICY "Allow delete for debtor transactions"
ON "public"."debtor_transactions"
AS permissive
FOR DELETE
TO public
USING ((debtor_id IN ( SELECT debtors.id
   FROM debtors
  WHERE (debtors.shop_id = ( SELECT profiles.shop_id
           FROM profiles
          WHERE (profiles.id = (select auth.uid())))))));

DROP POLICY IF EXISTS "Allow insert for debtor transactions" ON "public"."debtor_transactions";
CREATE POLICY "Allow insert for debtor transactions"
ON "public"."debtor_transactions"
AS permissive
FOR INSERT
TO public
WITH CHECK ((debtor_id IN ( SELECT debtors.id
   FROM debtors
  WHERE (debtors.shop_id = ( SELECT profiles.shop_id
           FROM profiles
          WHERE (profiles.id = (select auth.uid())))))));

DROP POLICY IF EXISTS "Allow update for debtor transactions" ON "public"."debtor_transactions";
CREATE POLICY "Allow update for debtor transactions"
ON "public"."debtor_transactions"
AS permissive
FOR UPDATE
TO public
USING ((debtor_id IN ( SELECT debtors.id
   FROM debtors
  WHERE (debtors.shop_id = ( SELECT profiles.shop_id
           FROM profiles
          WHERE (profiles.id = (select auth.uid())))))));

DROP POLICY IF EXISTS "Allow view for debtor transactions" ON "public"."debtor_transactions";
CREATE POLICY "Allow view for debtor transactions"
ON "public"."debtor_transactions"
AS permissive
FOR SELECT
TO public
USING ((debtor_id IN ( SELECT debtors.id
   FROM debtors
  WHERE (debtors.shop_id = ( SELECT profiles.shop_id
           FROM profiles
          WHERE (profiles.id = (select auth.uid())))))));

-- ============================================================
-- TABLE: debtors
-- Fix: wrap auth.uid() with (select auth.uid())
-- ============================================================

DROP POLICY IF EXISTS "Allow delete for shop users" ON "public"."debtors";
CREATE POLICY "Allow delete for shop users"
ON "public"."debtors"
AS permissive
FOR DELETE
TO public
USING ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

DROP POLICY IF EXISTS "Allow insert for shop users" ON "public"."debtors";
CREATE POLICY "Allow insert for shop users"
ON "public"."debtors"
AS permissive
FOR INSERT
TO public
WITH CHECK ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

DROP POLICY IF EXISTS "Allow update for shop users" ON "public"."debtors";
CREATE POLICY "Allow update for shop users"
ON "public"."debtors"
AS permissive
FOR UPDATE
TO public
USING ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))))
WITH CHECK ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

DROP POLICY IF EXISTS "Allow view for shop users" ON "public"."debtors";
CREATE POLICY "Allow view for shop users"
ON "public"."debtors"
AS permissive
FOR SELECT
TO public
USING (((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))) OR ((blacklist = true) AND (( SELECT shops.city
   FROM shops
  WHERE (shops.id = debtors.shop_id)) = ( SELECT shops.city
   FROM (shops
     JOIN profiles ON ((profiles.shop_id = shops.id)))
  WHERE (profiles.id = (select auth.uid())))))));

-- ============================================================
-- TABLE: employee_sessions
-- Fix: wrap auth.uid() + consolidate 2 SELECT policies into 1
-- ============================================================

DROP POLICY IF EXISTS "Admins can create employee sessions" ON "public"."employee_sessions";
CREATE POLICY "Admins can create employee sessions"
ON "public"."employee_sessions"
AS permissive
FOR INSERT
TO public
WITH CHECK (((select auth.uid()) = admin_id));

DROP POLICY IF EXISTS "Admins can delete their employee sessions" ON "public"."employee_sessions";
CREATE POLICY "Admins can delete their employee sessions"
ON "public"."employee_sessions"
AS permissive
FOR DELETE
TO public
USING (((select auth.uid()) = admin_id));

DROP POLICY IF EXISTS "Admins can update their employee sessions" ON "public"."employee_sessions";
CREATE POLICY "Admins can update their employee sessions"
ON "public"."employee_sessions"
AS permissive
FOR UPDATE
TO public
USING (((select auth.uid()) = admin_id));

-- Consolidate 2 SELECT policies into 1
DROP POLICY IF EXISTS "Admins can view their employee sessions" ON "public"."employee_sessions";
DROP POLICY IF EXISTS "Employees can view their own session" ON "public"."employee_sessions";
CREATE POLICY "View employee sessions"
ON "public"."employee_sessions"
AS permissive
FOR SELECT
TO public
USING (((select auth.uid()) = admin_id) OR ((select auth.uid()) = employee_id));

-- ============================================================
-- TABLE: employees
-- Fix: wrap auth.uid() with (select auth.uid())
-- ============================================================

DROP POLICY IF EXISTS "Allow access to employees of the same shop" ON "public"."employees";
CREATE POLICY "Allow access to employees of the same shop"
ON "public"."employees"
AS permissive
FOR SELECT
TO public
USING ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

DROP POLICY IF EXISTS "Allow deletion of employees by the same shop's admin" ON "public"."employees";
CREATE POLICY "Allow deletion of employees by the same shop's admin"
ON "public"."employees"
AS permissive
FOR DELETE
TO public
USING ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

DROP POLICY IF EXISTS "Allow insertion of employees by the same shop's admin" ON "public"."employees";
CREATE POLICY "Allow insertion of employees by the same shop's admin"
ON "public"."employees"
AS permissive
FOR INSERT
TO public
WITH CHECK ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

DROP POLICY IF EXISTS "Allow updates to employees by the same shop's admin" ON "public"."employees";
CREATE POLICY "Allow updates to employees by the same shop's admin"
ON "public"."employees"
AS permissive
FOR UPDATE
TO public
USING ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))))
WITH CHECK ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

-- ============================================================
-- TABLE: expenses
-- Fix: wrap auth.uid() with (select auth.uid())
-- ============================================================

DROP POLICY IF EXISTS "Allow shop members to delete expenses" ON "public"."expenses";
CREATE POLICY "Allow shop members to delete expenses"
ON "public"."expenses"
AS permissive
FOR DELETE
TO public
USING ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

DROP POLICY IF EXISTS "Allow shop members to insert expenses" ON "public"."expenses";
CREATE POLICY "Allow shop members to insert expenses"
ON "public"."expenses"
AS permissive
FOR INSERT
TO public
WITH CHECK ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

DROP POLICY IF EXISTS "Allow shop members to read expenses" ON "public"."expenses";
CREATE POLICY "Allow shop members to read expenses"
ON "public"."expenses"
AS permissive
FOR SELECT
TO public
USING ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

DROP POLICY IF EXISTS "Allow shop members to update expenses" ON "public"."expenses";
CREATE POLICY "Allow shop members to update expenses"
ON "public"."expenses"
AS permissive
FOR UPDATE
TO public
USING ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))))
WITH CHECK ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

-- ============================================================
-- TABLE: file_references
-- Fix: wrap auth.uid() with (select auth.uid())
-- ============================================================

DROP POLICY IF EXISTS "Allow delete for users with shop access" ON "public"."file_references";
CREATE POLICY "Allow delete for users with shop access"
ON "public"."file_references"
AS permissive
FOR DELETE
TO public
USING ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

DROP POLICY IF EXISTS "Allow insert for users with shop access" ON "public"."file_references";
CREATE POLICY "Allow insert for users with shop access"
ON "public"."file_references"
AS permissive
FOR INSERT
TO public
WITH CHECK ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

DROP POLICY IF EXISTS "Allow update for users with shop access" ON "public"."file_references";
CREATE POLICY "Allow update for users with shop access"
ON "public"."file_references"
AS permissive
FOR UPDATE
TO public
USING ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

DROP POLICY IF EXISTS "Allow view for users with shop access" ON "public"."file_references";
CREATE POLICY "Allow view for users with shop access"
ON "public"."file_references"
AS permissive
FOR SELECT
TO public
USING ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

-- ============================================================
-- TABLE: notes
-- Fix: wrap auth.uid() with (select auth.uid())
-- ============================================================

DROP POLICY IF EXISTS "Allow users to delete their own notes" ON "public"."notes";
CREATE POLICY "Allow users to delete their own notes"
ON "public"."notes"
AS permissive
FOR DELETE
TO public
USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Allow users to insert their own notes" ON "public"."notes";
CREATE POLICY "Allow users to insert their own notes"
ON "public"."notes"
AS permissive
FOR INSERT
TO public
WITH CHECK (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Allow users to select their own notes" ON "public"."notes";
CREATE POLICY "Allow users to select their own notes"
ON "public"."notes"
AS permissive
FOR SELECT
TO public
USING (((select auth.uid()) = user_id));

DROP POLICY IF EXISTS "Allow users to update their own notes" ON "public"."notes";
CREATE POLICY "Allow users to update their own notes"
ON "public"."notes"
AS permissive
FOR UPDATE
TO public
USING (((select auth.uid()) = user_id))
WITH CHECK (((select auth.uid()) = user_id));

-- ============================================================
-- TABLE: profiles
-- Fix: wrap auth.uid() + consolidate duplicate INSERT/SELECT/UPDATE
-- ============================================================

-- DELETE: fix initplan
DROP POLICY IF EXISTS "Allow admin to delete" ON "public"."profiles";
CREATE POLICY "Allow admin to delete"
ON "public"."profiles"
AS permissive
FOR DELETE
TO public
USING ((EXISTS ( SELECT 1
   FROM profiles p
  WHERE ((p.id = (select auth.uid())) AND (p.role_id = 1)))));

-- INSERT: consolidate 2 policies into 1
-- "Allow profile creation for users with users scope" (checks role scope)
-- "Allow users to insert their own profile" (checks uid = id)
DROP POLICY IF EXISTS "Allow profile creation for users with users scope" ON "public"."profiles";
DROP POLICY IF EXISTS "Allow users to insert their own profile" ON "public"."profiles";
CREATE POLICY "Allow profile insert"
ON "public"."profiles"
AS permissive
FOR INSERT
TO authenticated
WITH CHECK (
  (( SELECT auth.uid() AS uid) = id)
  OR
  (EXISTS ( SELECT 1
     FROM (roles
       JOIN profiles profiles_1 ON ((profiles_1.role_id = roles.id)))
    WHERE ((profiles_1.id = (select auth.uid())) AND ('users'::text = ANY (roles.scope)))))
);

-- SELECT: consolidate 2 policies
-- "Allow users to select their own profile" (authenticated, uid = id)
-- "Public profiles are viewable by everyone." (public, true)
-- Since "true" already covers everything, just keep one open policy
DROP POLICY IF EXISTS "Allow users to select their own profile" ON "public"."profiles";
DROP POLICY IF EXISTS "Public profiles are viewable by everyone." ON "public"."profiles";
CREATE POLICY "Public profiles are viewable by everyone."
ON "public"."profiles"
AS permissive
FOR SELECT
TO public
USING (true);

-- UPDATE: consolidate 2 policies into 1
-- "Allow users to update their own profile" (authenticated, uid = id, with check)
-- "Users can update own profile." (public, uid = id)
DROP POLICY IF EXISTS "Allow users to update their own profile" ON "public"."profiles";
DROP POLICY IF EXISTS "Users can update own profile." ON "public"."profiles";
CREATE POLICY "Users can update own profile"
ON "public"."profiles"
AS permissive
FOR UPDATE
TO authenticated
USING (((select auth.uid()) = id))
WITH CHECK (((select auth.uid()) = id));

-- ============================================================
-- TABLE: roles
-- Fix: wrap auth.uid() with (select auth.uid())
-- ============================================================

DROP POLICY IF EXISTS "Allow authenticated read access" ON "public"."roles";
CREATE POLICY "Allow authenticated read access"
ON "public"."roles"
AS permissive
FOR SELECT
TO public
USING (((select auth.uid()) IS NOT NULL));

-- ============================================================
-- TABLE: shop_statistics
-- Fix: wrap auth.uid() with (select auth.uid())
-- ============================================================

DROP POLICY IF EXISTS "Allow delete for shop users" ON "public"."shop_statistics";
CREATE POLICY "Allow delete for shop users"
ON "public"."shop_statistics"
AS permissive
FOR DELETE
TO public
USING ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

DROP POLICY IF EXISTS "Allow insert for shop users" ON "public"."shop_statistics";
CREATE POLICY "Allow insert for shop users"
ON "public"."shop_statistics"
AS permissive
FOR INSERT
TO public
WITH CHECK ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

DROP POLICY IF EXISTS "Allow update for shop users" ON "public"."shop_statistics";
CREATE POLICY "Allow update for shop users"
ON "public"."shop_statistics"
AS permissive
FOR UPDATE
TO public
USING ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

DROP POLICY IF EXISTS "Allow view for shop users" ON "public"."shop_statistics";
CREATE POLICY "Allow view for shop users"
ON "public"."shop_statistics"
AS permissive
FOR SELECT
TO public
USING ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

-- ============================================================
-- TABLE: shops
-- Fix: wrap auth.uid()/auth.role() + resolve duplicate SELECT
-- Split "for all" admin policy into INSERT/UPDATE/DELETE only
-- Keep separate SELECT policy for all authenticated users
-- ============================================================

DROP POLICY IF EXISTS "Allow admin to manage shops" ON "public"."shops";
DROP POLICY IF EXISTS "Allow authenticated users to select" ON "public"."shops";

-- Admin can INSERT/UPDATE/DELETE
CREATE POLICY "Allow admin to manage shops"
ON "public"."shops"
AS permissive
FOR INSERT
TO public
WITH CHECK ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = (select auth.uid())) AND (profiles.role_id = 1)))));

CREATE POLICY "Allow admin to update shops"
ON "public"."shops"
AS permissive
FOR UPDATE
TO public
USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = (select auth.uid())) AND (profiles.role_id = 1)))))
WITH CHECK ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = (select auth.uid())) AND (profiles.role_id = 1)))));

CREATE POLICY "Allow admin to delete shops"
ON "public"."shops"
AS permissive
FOR DELETE
TO public
USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = (select auth.uid())) AND (profiles.role_id = 1)))));

-- All authenticated users can SELECT
CREATE POLICY "Allow authenticated users to select"
ON "public"."shops"
AS permissive
FOR SELECT
TO public
USING (((select auth.role()) = 'authenticated'::text));

-- ============================================================
-- TABLE: subscription_payments
-- Fix: wrap auth.uid() with (select auth.uid())
-- ============================================================

DROP POLICY IF EXISTS "select_subscription_payments_by_shop" ON "public"."subscription_payments";
CREATE POLICY "select_subscription_payments_by_shop"
ON "public"."subscription_payments"
AS permissive
FOR SELECT
TO public
USING ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

-- ============================================================
-- TABLE: user_action_logs
-- Fix: wrap auth.uid()/auth.role() with (select ...)
-- ============================================================

DROP POLICY IF EXISTS "Allow admin to delete" ON "public"."user_action_logs";
CREATE POLICY "Allow admin to delete"
ON "public"."user_action_logs"
AS permissive
FOR DELETE
TO public
USING ((EXISTS ( SELECT 1
   FROM profiles
  WHERE ((profiles.id = (select auth.uid())) AND (profiles.role_id = 1)))));

DROP POLICY IF EXISTS "Allow authenticated users to insert" ON "public"."user_action_logs";
CREATE POLICY "Allow authenticated users to insert"
ON "public"."user_action_logs"
AS permissive
FOR INSERT
TO public
WITH CHECK (((select auth.role()) = 'authenticated'::text));

DROP POLICY IF EXISTS "Allow authenticated users to select" ON "public"."user_action_logs";
CREATE POLICY "Allow authenticated users to select"
ON "public"."user_action_logs"
AS permissive
FOR SELECT
TO public
USING (((select auth.role()) = 'authenticated'::text));

-- ============================================================
-- TABLE: cash_shifts
-- Fix: wrap auth.uid() + remove duplicate SELECT/UPDATE policies
-- Keep cash_shifts_select & cash_shifts_mod (use current_shop_id())
-- Drop select_cash_shifts_by_shop & update_cash_shifts_for_shop (duplicates)
-- Fix initplan on delete & insert policies
-- ============================================================

DROP POLICY IF EXISTS "select_cash_shifts_by_shop" ON "public"."cash_shifts";
DROP POLICY IF EXISTS "update_cash_shifts_for_shop" ON "public"."cash_shifts";

DROP POLICY IF EXISTS "delete_cash_shifts_for_shop" ON "public"."cash_shifts";
CREATE POLICY "delete_cash_shifts_for_shop"
ON "public"."cash_shifts"
AS permissive
FOR DELETE
TO public
USING ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

DROP POLICY IF EXISTS "insert_cash_shifts_for_shop" ON "public"."cash_shifts";
CREATE POLICY "insert_cash_shifts_for_shop"
ON "public"."cash_shifts"
AS permissive
FOR INSERT
TO public
WITH CHECK ((shop_id = ( SELECT profiles.shop_id
   FROM profiles
  WHERE (profiles.id = (select auth.uid())))));

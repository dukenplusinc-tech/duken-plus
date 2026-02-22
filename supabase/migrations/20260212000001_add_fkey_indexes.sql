-- Fix unindexed foreign keys and drop unused indexes

-- ============================================================
-- Add missing foreign key indexes
-- ============================================================

CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_messages_reply_to ON public.chat_messages (reply_to);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_messages_shop_id ON public.chat_messages (shop_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_chat_reports_chat_message_id ON public.chat_reports (chat_message_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_contractors_shop_id ON public.contractors (shop_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_debtors_shop_id ON public.debtors (shop_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_deliveries_contractor_id ON public.deliveries (contractor_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_deliveries_shop_id ON public.deliveries (shop_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_employee_sessions_admin_id ON public.employee_sessions (admin_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_employee_sessions_auth_id ON public.employee_sessions (auth_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_employee_sessions_employee_id ON public.employee_sessions (employee_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_employee_sessions_shop_id ON public.employee_sessions (shop_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_employees_shop_id ON public.employees (shop_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_expenses_shop_id ON public.expenses (shop_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_file_references_shop_id ON public.file_references (shop_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_file_references_uploaded_by ON public.file_references (uploaded_by);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_notes_user_id ON public.notes (user_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_role_id ON public.profiles (role_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_shop_id ON public.profiles (shop_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_subscription_payments_shop_id ON public.subscription_payments (shop_id);
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_user_action_logs_employee_id ON public.user_action_logs (employee_id);

-- ============================================================
-- Drop unused indexes
-- ============================================================

DROP INDEX CONCURRENTLY IF EXISTS public.idx_user_action_logs_timestamp;
DROP INDEX CONCURRENTLY IF EXISTS public.cash_shifts_status_idx;

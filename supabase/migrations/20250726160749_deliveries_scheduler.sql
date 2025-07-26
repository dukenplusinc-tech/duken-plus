set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.mark_overdue_deliveries()
 RETURNS void
 LANGUAGE plpgsql
AS $function$
BEGIN
  UPDATE deliveries
  SET status = 'due'
  WHERE status = 'pending' AND expected_date < CURRENT_DATE;
END;
$function$
;

-- Enable pg_cron (safe even if already enabled)
create extension if not exists pg_cron;

-- Schedule the function to run daily at 02:00 AM if not yet scheduled
do $$
begin
  if not exists (
    select 1 from cron.job where jobname = 'mark-overdue-deliveries-daily'
  ) then
    perform cron.schedule(
      'mark-overdue-deliveries-daily',
      '0 2 * * *',
      'call public.mark_overdue_deliveries();'
    );
  end if;
end;
$$;

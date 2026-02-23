-- Schedule auto_close_cash_shifts to run every 15 minutes
do $$
begin
  if not exists (
    select 1 from cron.job where jobname = 'auto-close-cash-shifts'
  ) then
    perform cron.schedule(
      'auto-close-cash-shifts',
      '0 * * * *',
      'select public.auto_close_cash_shifts();'
    );
  end if;
end;
$$;

-- Allow anonymous users to read cities for registration purposes
-- Drop policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous users to select cities" ON "public"."cities";

CREATE POLICY "Allow anonymous users to select cities"
ON "public"."cities"
AS PERMISSIVE
FOR SELECT
TO anon
USING (true);

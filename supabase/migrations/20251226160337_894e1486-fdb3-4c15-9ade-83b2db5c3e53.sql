-- Drop the conflicting RESTRICTIVE policy that blocks tenant creation
DROP POLICY IF EXISTS tenants_member_manage ON tenants;

-- Create separate PERMISSIVE policies for each operation

-- Allow any authenticated user to create a tenant
CREATE POLICY tenants_insert_authenticated 
ON tenants 
FOR INSERT 
TO authenticated 
WITH CHECK (true);

-- Allow tenant members to view their tenants
CREATE POLICY tenants_select_members 
ON tenants 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM tenant_members tm 
    WHERE tm.tenant_id = tenants.id 
    AND tm.user_id = auth.uid()
  )
);

-- Allow tenant members to update their tenants
CREATE POLICY tenants_update_members 
ON tenants 
FOR UPDATE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM tenant_members tm 
    WHERE tm.tenant_id = tenants.id 
    AND tm.user_id = auth.uid()
  )
)
WITH CHECK (
  EXISTS (
    SELECT 1 FROM tenant_members tm 
    WHERE tm.tenant_id = tenants.id 
    AND tm.user_id = auth.uid()
  )
);

-- Allow tenant members to delete their tenants
CREATE POLICY tenants_delete_members 
ON tenants 
FOR DELETE 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM tenant_members tm 
    WHERE tm.tenant_id = tenants.id 
    AND tm.user_id = auth.uid()
  )
);
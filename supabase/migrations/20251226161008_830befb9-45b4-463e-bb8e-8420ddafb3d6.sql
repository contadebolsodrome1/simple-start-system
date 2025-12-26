-- Remover política duplicada
DROP POLICY IF EXISTS tenants_insert_any ON tenants;

-- Redefinir tenants_insert_authenticated com clareza
DROP POLICY IF EXISTS tenants_insert_authenticated ON tenants;

CREATE POLICY tenants_insert_authenticated 
ON tenants 
FOR INSERT 
TO authenticated 
WITH CHECK (true);
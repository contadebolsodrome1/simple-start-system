-- Auth/tenant bootstrap helpers and RLS fixes

-- 1) Enable RLS on tenants table (already enabled on tenant_members)
ALTER TABLE tenants ENABLE ROW LEVEL SECURITY;

-- 2) Basic tenants policies
-- Allow authenticated users to create tenants
CREATE POLICY tenants_insert_any
  ON tenants
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Allow members to view/update/delete their tenants
CREATE POLICY tenants_member_manage
  ON tenants
  FOR ALL
  TO authenticated
  USING (EXISTS (
    SELECT 1 FROM tenant_members tm
    WHERE tm.tenant_id = tenants.id
      AND tm.user_id = auth.uid()
  ))
  WITH CHECK (EXISTS (
    SELECT 1 FROM tenant_members tm
    WHERE tm.tenant_id = tenants.id
      AND tm.user_id = auth.uid()
  ));

-- 3) tenant_members policies
-- A user can see their own memberships
CREATE POLICY tenant_members_select_own
  ON tenant_members
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- A user can insert their own membership rows
CREATE POLICY tenant_members_insert_self
  ON tenant_members
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

-- A user can update/delete only their memberships
CREATE POLICY tenant_members_update_self
  ON tenant_members
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY tenant_members_delete_self
  ON tenant_members
  FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

-- 4) Optional profiles table (for future use)
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text,
  last_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_select_own
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY profiles_upsert_own
  ON public.profiles
  FOR ALL
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

-- Timestamp trigger for profiles
CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_profiles_updated_at();
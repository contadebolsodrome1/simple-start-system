-- =====================================================
-- FASE 3: Seed Inicial de Dados para Super Admin
-- =====================================================

-- ID do usuário super_admin: 9d49ea12-af3a-41b8-9ed4-9b75fd383e3c

-- 1. Criar tenant para o super admin
INSERT INTO public.tenants (id, name, slug, status, plan)
VALUES (
  '00000000-0000-0000-0000-000000000001'::UUID,
  'DromeFlow Admin',
  'dromeflow-admin',
  'active',
  'enterprise'
)
ON CONFLICT (id) DO NOTHING;

-- 2. Adicionar super admin como membro do tenant
INSERT INTO public.tenant_members (tenant_id, user_id, email, role)
VALUES (
  '00000000-0000-0000-0000-000000000001'::UUID,
  '9d49ea12-af3a-41b8-9ed4-9b75fd383e3c'::UUID,
  'admin@dromeflow.com',
  'admin'
)
ON CONFLICT (tenant_id, user_id) DO NOTHING;

-- 3. Adicionar role super_admin na tabela user_roles
INSERT INTO public.user_roles (user_id, role, created_by)
VALUES (
  '9d49ea12-af3a-41b8-9ed4-9b75fd383e3c'::UUID,
  'super_admin'::public.app_role,
  '9d49ea12-af3a-41b8-9ed4-9b75fd383e3c'::UUID
)
ON CONFLICT (user_id, role) DO NOTHING;
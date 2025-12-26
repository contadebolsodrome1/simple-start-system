-- Final attempt: same schema, but plain CREATE TRIGGER (no IF NOT EXISTS)

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. TENANT & ORGANIZATION (Multi-tenant)
CREATE TABLE IF NOT EXISTS tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  plan TEXT DEFAULT 'starter',
  status TEXT DEFAULT 'active',
  subscription_id TEXT,
  billing_email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS tenant_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, user_id)
);

-- 3. IDEAS MODULE
CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  current_phase TEXT DEFAULT 'conception',
  status TEXT DEFAULT 'active',
  category TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS idea_phases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  phase_type TEXT NOT NULL,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  notes TEXT,
  assignee_id UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS idea_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  doc_type TEXT,
  version INT DEFAULT 1,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS idea_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size INT,
  mime_type TEXT,
  uploaded_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS idea_tags (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  idea_id UUID NOT NULL REFERENCES ideas(id) ON DELETE CASCADE,
  tag TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(idea_id, tag)
);

-- 4. PROCESSES MODULE
CREATE TABLE IF NOT EXISTS processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  category TEXT,
  complexity TEXT DEFAULT 'medium',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS process_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id UUID NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
  step_number INT NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  actor TEXT,
  duration_minutes INT,
  required_data JSONB,
  output_data JSONB,
  is_automatable BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS process_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  process_id UUID NOT NULL REFERENCES processes(id) ON DELETE CASCADE,
  flow_diagram JSONB,
  automation_potential TEXT,
  estimated_savings_percent DECIMAL(5, 2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. CLIENTS MODULE
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  cnpj TEXT,
  industry TEXT,
  website TEXT,
  status TEXT DEFAULT 'active',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS client_teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  department TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS client_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  role TEXT,
  is_primary BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS client_processes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  process_id UUID REFERENCES processes(id),
  mapped_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'pending'
);

CREATE TABLE IF NOT EXISTS client_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  metric_name TEXT NOT NULL,
  metric_value DECIMAL(10, 2),
  period TEXT,
  measured_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. SYSTEM ARCHITECT
CREATE TABLE IF NOT EXISTS system_blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  client_id UUID REFERENCES clients(id),
  idea_id UUID REFERENCES ideas(id),
  name TEXT NOT NULL,
  description TEXT,
  architecture_type TEXT,
  status TEXT DEFAULT 'draft',
  version INT DEFAULT 1,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID NOT NULL REFERENCES system_blueprints(id) ON DELETE CASCADE,
  entity_name TEXT NOT NULL,
  entity_type TEXT,
  description TEXT,
  fields JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS system_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID NOT NULL REFERENCES system_blueprints(id) ON DELETE CASCADE,
  from_entity_id UUID NOT NULL REFERENCES system_entities(id),
  to_entity_id UUID NOT NULL REFERENCES system_entities(id),
  relationship_type TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. MODULES LIBRARY + system_modules
CREATE TABLE IF NOT EXISTS module_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  category TEXT,
  description TEXT,
  is_public BOOLEAN DEFAULT FALSE,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS module_versions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_template_id UUID NOT NULL REFERENCES module_templates(id) ON DELETE CASCADE,
  version_number TEXT,
  description TEXT,
  specification JSONB,
  example_code TEXT,
  documentation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS module_dependencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_template_id UUID NOT NULL REFERENCES module_templates(id),
  depends_on_module_id UUID NOT NULL REFERENCES module_templates(id),
  version_constraint TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(module_template_id, depends_on_module_id)
);

CREATE TABLE IF NOT EXISTS system_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID NOT NULL REFERENCES system_blueprints(id) ON DELETE CASCADE,
  module_template_id UUID NOT NULL REFERENCES module_templates(id),
  integration_config JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS architecture_patterns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blueprint_id UUID NOT NULL REFERENCES system_blueprints(id) ON DELETE CASCADE,
  pattern_name TEXT,
  description TEXT,
  implementation_details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. SECRETS
CREATE TABLE IF NOT EXISTS secrets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  tool TEXT NOT NULL,
  key_type TEXT NOT NULL,
  value_encrypted TEXT NOT NULL,
  value_hash TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  client_id TEXT,
  status TEXT DEFAULT 'active',
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  last_accessed_at TIMESTAMPTZ,
  access_count INT DEFAULT 0,
  notes TEXT,
  used_in TEXT[] DEFAULT ARRAY[]::TEXT[],
  visibility TEXT DEFAULT 'masked',
  UNIQUE(tenant_id, name)
);

CREATE TABLE IF NOT EXISTS secret_access_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  secret_id UUID NOT NULL REFERENCES secrets(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id),
  action TEXT,
  ip_address TEXT,
  accessed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. AUTOMATIONS & N8N
CREATE TABLE IF NOT EXISTS automation_flows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  trigger_type TEXT,
  trigger_config JSONB,
  n8n_workflow_id TEXT,
  n8n_workflow_name TEXT,
  status TEXT DEFAULT 'inactive',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flow_actions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_flow_id UUID NOT NULL REFERENCES automation_flows(id) ON DELETE CASCADE,
  action_type TEXT,
  action_config JSONB,
  order_index INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS flow_executions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  automation_flow_id UUID NOT NULL REFERENCES automation_flows(id),
  n8n_execution_id TEXT,
  status TEXT DEFAULT 'pending',
  input_data JSONB,
  output_data JSONB,
  error_message TEXT,
  executed_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  duration_ms INT
);

CREATE TABLE IF NOT EXISTS n8n_integrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  api_key_encrypted TEXT NOT NULL,
  api_key_hash TEXT NOT NULL,
  base_url TEXT NOT NULL,
  status TEXT DEFAULT 'active',
  last_sync TIMESTAMPTZ,
  sync_count INT DEFAULT 0,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id)
);

CREATE TABLE IF NOT EXISTS n8n_workflows_sync (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  n8n_workflow_id TEXT NOT NULL,
  n8n_workflow_name TEXT NOT NULL,
  n8n_active BOOLEAN DEFAULT FALSE,
  dromeflow_automation_id UUID REFERENCES automation_flows(id),
  last_synced TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tenant_id, n8n_workflow_id)
);

-- 10. AUDIT & EVENTS
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id),
  entity_type TEXT,
  entity_id UUID,
  action TEXT,
  changes JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS event_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  event_type TEXT,
  payload JSONB,
  processed BOOLEAN DEFAULT FALSE,
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 11. INDEXES
CREATE INDEX IF NOT EXISTS idx_ideas_tenant_id ON ideas(tenant_id);
CREATE INDEX IF NOT EXISTS idx_ideas_created_by ON ideas(created_by);
CREATE INDEX IF NOT EXISTS idx_ideas_status ON ideas(status);
CREATE INDEX IF NOT EXISTS idx_idea_phases_idea_id ON idea_phases(idea_id);
CREATE INDEX IF NOT EXISTS idx_idea_attachments_idea_id ON idea_attachments(idea_id);

CREATE INDEX IF NOT EXISTS idx_clients_tenant_id ON clients(tenant_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_client_contacts_client_id ON client_contacts(client_id);
CREATE INDEX IF NOT EXISTS idx_client_processes_client_id ON client_processes(client_id);

CREATE INDEX IF NOT EXISTS idx_processes_tenant_id ON processes(tenant_id);
CREATE INDEX IF NOT EXISTS idx_processes_category ON processes(category);
CREATE INDEX IF NOT EXISTS idx_process_steps_process_id ON process_steps(process_id);

CREATE INDEX IF NOT EXISTS idx_blueprints_tenant_id ON system_blueprints(tenant_id);
CREATE INDEX IF NOT EXISTS idx_blueprints_client_id ON system_blueprints(client_id);
CREATE INDEX IF NOT EXISTS idx_blueprints_status ON system_blueprints(status);
CREATE INDEX IF NOT EXISTS idx_entities_blueprint_id ON system_entities(blueprint_id);

CREATE INDEX IF NOT EXISTS idx_secrets_tenant_id ON secrets(tenant_id);
CREATE INDEX IF NOT EXISTS idx_secrets_tool ON secrets(tool);
CREATE INDEX IF NOT EXISTS idx_secrets_status ON secrets(status);
CREATE INDEX IF NOT EXISTS idx_secret_access_log_secret_id ON secret_access_log(secret_id);

CREATE INDEX IF NOT EXISTS idx_automations_tenant_id ON automation_flows(tenant_id);
CREATE INDEX IF NOT EXISTS idx_automations_status ON automation_flows(status);
CREATE INDEX IF NOT EXISTS idx_flow_executions_automation_id ON flow_executions(automation_flow_id);
CREATE INDEX IF NOT EXISTS idx_n8n_integrations_tenant_id ON n8n_integrations(tenant_id);

CREATE INDEX IF NOT EXISTS idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_entity_id ON audit_logs(entity_id);
CREATE INDEX IF NOT EXISTS idx_event_logs_tenant_id ON event_logs(tenant_id);
CREATE INDEX IF NOT EXISTS idx_event_logs_event_type ON event_logs(event_type);

-- 12. RLS
ALTER TABLE ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_phases ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE idea_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE process_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_blueprints ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE system_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE architecture_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE module_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE secrets ENABLE ROW LEVEL SECURITY;
ALTER TABLE secret_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE automation_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE flow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE n8n_integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE event_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE tenant_members ENABLE ROW LEVEL SECURITY;

-- 13. RLS POLICIES
CREATE OR REPLACE FUNCTION get_user_tenant_id()
RETURNS UUID AS $$
BEGIN
  RETURN (SELECT tenant_id FROM tenant_members WHERE user_id = auth.uid() LIMIT 1);
END;
$$ LANGUAGE plpgsql;

CREATE POLICY tenant_isolation_ideas ON ideas
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY tenant_isolation_clients ON clients
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY tenant_isolation_processes ON processes
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY tenant_isolation_blueprints ON system_blueprints
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY tenant_isolation_secrets ON secrets
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY tenant_isolation_automations ON automation_flows
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY tenant_isolation_n8n ON n8n_integrations
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY tenant_isolation_audit ON audit_logs
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY tenant_isolation_events ON event_logs
  USING (tenant_id = get_user_tenant_id())
  WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY tenant_isolation_idea_phases ON idea_phases
  USING (idea_id IN (SELECT id FROM ideas WHERE tenant_id = get_user_tenant_id()))
  WITH CHECK (idea_id IN (SELECT id FROM ideas WHERE tenant_id = get_user_tenant_id()));

CREATE POLICY tenant_isolation_client_contacts ON client_contacts
  USING (client_id IN (SELECT id FROM clients WHERE tenant_id = get_user_tenant_id()))
  WITH CHECK (client_id IN (SELECT id FROM clients WHERE tenant_id = get_user_tenant_id()));

CREATE POLICY tenant_isolation_process_steps ON process_steps
  USING (process_id IN (SELECT id FROM processes WHERE tenant_id = get_user_tenant_id()))
  WITH CHECK (process_id IN (SELECT id FROM processes WHERE tenant_id = get_user_tenant_id()));

-- 14. VIEWS
CREATE OR REPLACE VIEW ideas_dashboard AS
SELECT 
  i.id,
  i.title,
  i.current_phase,
  COUNT(DISTINCT ip.id) as total_phases,
  COUNT(DISTINCT ia.id) as total_attachments,
  i.created_at,
  i.updated_at
FROM ideas i
LEFT JOIN idea_phases ip ON i.id = ip.idea_id
LEFT JOIN idea_attachments ia ON i.id = ia.idea_id
GROUP BY i.id, i.title, i.current_phase, i.created_at, i.updated_at;

CREATE OR REPLACE VIEW automations_status AS
SELECT 
  af.id,
  af.name,
  af.status,
  COUNT(DISTINCT fe.id) as total_executions,
  COUNT(DISTINCT CASE WHEN fe.status = 'success' THEN fe.id END) as successful_executions,
  COUNT(DISTINCT CASE WHEN fe.status = 'failed' THEN fe.id END) as failed_executions,
  ROUND(
    (COUNT(DISTINCT CASE WHEN fe.status = 'success' THEN fe.id END)::NUMERIC / 
     NULLIF(COUNT(DISTINCT fe.id), 0)) * 100, 2
  ) as success_rate
FROM automation_flows af
LEFT JOIN flow_executions fe ON af.id = fe.automation_flow_id
GROUP BY af.id, af.name, af.status;

CREATE OR REPLACE VIEW secrets_expiring_soon AS
SELECT 
  id,
  name,
  tool,
  expires_at,
  EXTRACT(DAY FROM expires_at - NOW()) as days_until_expiry
FROM secrets
WHERE expires_at IS NOT NULL
  AND expires_at <= NOW() + INTERVAL '7 days'
  AND status = 'active'
ORDER BY expires_at ASC;

-- 15. TRIGGERS & FUNCTIONS
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_ideas_updated_at BEFORE UPDATE ON ideas
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_processes_updated_at BEFORE UPDATE ON processes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_blueprints_updated_at BEFORE UPDATE ON system_blueprints
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_secrets_updated_at BEFORE UPDATE ON secrets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_automations_updated_at BEFORE UPDATE ON automation_flows
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION audit_log_function()
RETURNS TRIGGER AS $$
DECLARE
  v_tenant_id UUID;
BEGIN
  CASE TG_TABLE_NAME
    WHEN 'ideas' THEN v_tenant_id := NEW.tenant_id;
    WHEN 'clients' THEN v_tenant_id := NEW.tenant_id;
    WHEN 'processes' THEN v_tenant_id := NEW.tenant_id;
    WHEN 'system_blueprints' THEN v_tenant_id := NEW.tenant_id;
    WHEN 'automation_flows' THEN v_tenant_id := NEW.tenant_id;
    WHEN 'secrets' THEN v_tenant_id := NEW.tenant_id;
  END CASE;

  INSERT INTO audit_logs (
    tenant_id,
    user_id,
    entity_type,
    entity_id,
    action,
    changes
  ) VALUES (
    v_tenant_id,
    auth.uid(),
    TG_TABLE_NAME,
    COALESCE(NEW.id, OLD.id),
    CASE WHEN TG_OP = 'DELETE' THEN 'delete' ELSE 'update' END,
    CASE WHEN TG_OP = 'DELETE' THEN to_jsonb(OLD) ELSE to_jsonb(NEW) END
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_ideas AFTER INSERT OR UPDATE OR DELETE ON ideas
  FOR EACH ROW EXECUTE FUNCTION audit_log_function();

CREATE TRIGGER audit_clients AFTER INSERT OR UPDATE OR DELETE ON clients
  FOR EACH ROW EXECUTE FUNCTION audit_log_function();

-- 16. STORED PROCEDURES
CREATE OR REPLACE FUNCTION get_idea_stats(p_tenant_id UUID)
RETURNS TABLE(
  total INT,
  conception_count INT,
  validation_count INT,
  structuring_count INT,
  implementation_count INT
) AS $$
SELECT
  COUNT(*) as total,
  COUNT(*) FILTER (WHERE current_phase = 'conception') as conception_count,
  COUNT(*) FILTER (WHERE current_phase = 'validation') as validation_count,
  COUNT(*) FILTER (WHERE current_phase = 'structuring') as structuring_count,
  COUNT(*) FILTER (WHERE current_phase = 'implementation') as implementation_count
FROM ideas
WHERE tenant_id = p_tenant_id;
$$ LANGUAGE SQL;

CREATE OR REPLACE FUNCTION get_client_summary(p_client_id UUID)
RETURNS TABLE(
  client_name TEXT,
  total_contacts INT,
  mapped_processes INT,
  total_metrics INT
) AS $$
SELECT
  c.name,
  COUNT(DISTINCT cc.id),
  COUNT(DISTINCT cp.id),
  COUNT(DISTINCT cm.id)
FROM clients c
LEFT JOIN client_contacts cc ON c.id = cc.client_id
LEFT JOIN client_processes cp ON c.id = cp.client_id
LEFT JOIN client_metrics cm ON c.id = cm.client_id
WHERE c.id = p_client_id
GROUP BY c.name;
$$ LANGUAGE SQL;
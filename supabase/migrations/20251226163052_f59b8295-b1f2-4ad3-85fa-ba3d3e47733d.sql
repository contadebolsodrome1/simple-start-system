-- =====================================================
-- Adicionar Políticas RLS para Tabelas Secundárias
-- =====================================================

-- ============= CLIENT METRICS =============
CREATE POLICY "tenant_isolation_client_metrics"
ON public.client_metrics
FOR ALL
TO authenticated
USING (
  client_id IN (
    SELECT id FROM clients WHERE tenant_id = get_user_tenant_id()
  )
)
WITH CHECK (
  client_id IN (
    SELECT id FROM clients WHERE tenant_id = get_user_tenant_id()
  )
);

-- ============= CLIENT PROCESSES =============
CREATE POLICY "tenant_isolation_client_processes"
ON public.client_processes
FOR ALL
TO authenticated
USING (
  client_id IN (
    SELECT id FROM clients WHERE tenant_id = get_user_tenant_id()
  )
)
WITH CHECK (
  client_id IN (
    SELECT id FROM clients WHERE tenant_id = get_user_tenant_id()
  )
);

-- ============= CLIENT TEAMS =============
CREATE POLICY "tenant_isolation_client_teams"
ON public.client_teams
FOR ALL
TO authenticated
USING (
  client_id IN (
    SELECT id FROM clients WHERE tenant_id = get_user_tenant_id()
  )
)
WITH CHECK (
  client_id IN (
    SELECT id FROM clients WHERE tenant_id = get_user_tenant_id()
  )
);

-- ============= FLOW ACTIONS =============
CREATE POLICY "tenant_isolation_flow_actions"
ON public.flow_actions
FOR ALL
TO authenticated
USING (
  automation_flow_id IN (
    SELECT id FROM automation_flows WHERE tenant_id = get_user_tenant_id()
  )
)
WITH CHECK (
  automation_flow_id IN (
    SELECT id FROM automation_flows WHERE tenant_id = get_user_tenant_id()
  )
);

-- ============= FLOW EXECUTIONS =============
CREATE POLICY "tenant_isolation_flow_executions"
ON public.flow_executions
FOR ALL
TO authenticated
USING (
  automation_flow_id IN (
    SELECT id FROM automation_flows WHERE tenant_id = get_user_tenant_id()
  )
)
WITH CHECK (
  automation_flow_id IN (
    SELECT id FROM automation_flows WHERE tenant_id = get_user_tenant_id()
  )
);

-- ============= IDEA ATTACHMENTS =============
CREATE POLICY "tenant_isolation_idea_attachments"
ON public.idea_attachments
FOR ALL
TO authenticated
USING (
  idea_id IN (
    SELECT id FROM ideas WHERE tenant_id = get_user_tenant_id()
  )
)
WITH CHECK (
  idea_id IN (
    SELECT id FROM ideas WHERE tenant_id = get_user_tenant_id()
  )
);

-- ============= IDEA DOCUMENTS =============
CREATE POLICY "tenant_isolation_idea_documents"
ON public.idea_documents
FOR ALL
TO authenticated
USING (
  idea_id IN (
    SELECT id FROM ideas WHERE tenant_id = get_user_tenant_id()
  )
)
WITH CHECK (
  idea_id IN (
    SELECT id FROM ideas WHERE tenant_id = get_user_tenant_id()
  )
);

-- ============= IDEA TAGS =============
CREATE POLICY "tenant_isolation_idea_tags"
ON public.idea_tags
FOR ALL
TO authenticated
USING (tenant_id = get_user_tenant_id())
WITH CHECK (tenant_id = get_user_tenant_id());

-- ============= MODULE DEPENDENCIES =============
CREATE POLICY "tenant_isolation_module_dependencies"
ON public.module_dependencies
FOR ALL
TO authenticated
USING (
  module_template_id IN (
    SELECT id FROM module_templates 
    WHERE tenant_id = get_user_tenant_id() OR is_public = true
  )
)
WITH CHECK (
  module_template_id IN (
    SELECT id FROM module_templates 
    WHERE tenant_id = get_user_tenant_id()
  )
);

-- ============= MODULE TEMPLATES =============
CREATE POLICY "tenant_isolation_module_templates"
ON public.module_templates
FOR SELECT
TO authenticated
USING (tenant_id = get_user_tenant_id() OR is_public = true);

CREATE POLICY "tenant_isolation_module_templates_write"
ON public.module_templates
FOR INSERT
TO authenticated
WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "tenant_isolation_module_templates_update"
ON public.module_templates
FOR UPDATE
TO authenticated
USING (tenant_id = get_user_tenant_id())
WITH CHECK (tenant_id = get_user_tenant_id());

CREATE POLICY "tenant_isolation_module_templates_delete"
ON public.module_templates
FOR DELETE
TO authenticated
USING (tenant_id = get_user_tenant_id());

-- ============= MODULE VERSIONS =============
CREATE POLICY "tenant_isolation_module_versions"
ON public.module_versions
FOR ALL
TO authenticated
USING (
  module_template_id IN (
    SELECT id FROM module_templates 
    WHERE tenant_id = get_user_tenant_id() OR is_public = true
  )
)
WITH CHECK (
  module_template_id IN (
    SELECT id FROM module_templates 
    WHERE tenant_id = get_user_tenant_id()
  )
);

-- ============= N8N WORKFLOWS SYNC =============
CREATE POLICY "tenant_isolation_n8n_workflows"
ON public.n8n_workflows_sync
FOR ALL
TO authenticated
USING (tenant_id = get_user_tenant_id())
WITH CHECK (tenant_id = get_user_tenant_id());

-- ============= PROCESS FLOWS =============
CREATE POLICY "tenant_isolation_process_flows"
ON public.process_flows
FOR ALL
TO authenticated
USING (
  process_id IN (
    SELECT id FROM processes WHERE tenant_id = get_user_tenant_id()
  )
)
WITH CHECK (
  process_id IN (
    SELECT id FROM processes WHERE tenant_id = get_user_tenant_id()
  )
);

-- ============= SECRET ACCESS LOG =============
CREATE POLICY "tenant_isolation_secret_access_log"
ON public.secret_access_log
FOR ALL
TO authenticated
USING (
  secret_id IN (
    SELECT id FROM secrets WHERE tenant_id = get_user_tenant_id()
  )
)
WITH CHECK (
  secret_id IN (
    SELECT id FROM secrets WHERE tenant_id = get_user_tenant_id()
  )
);

-- ============= SYSTEM ENTITIES =============
CREATE POLICY "tenant_isolation_system_entities"
ON public.system_entities
FOR ALL
TO authenticated
USING (
  blueprint_id IN (
    SELECT id FROM system_blueprints WHERE tenant_id = get_user_tenant_id()
  )
)
WITH CHECK (
  blueprint_id IN (
    SELECT id FROM system_blueprints WHERE tenant_id = get_user_tenant_id()
  )
);

-- ============= SYSTEM MODULES =============
CREATE POLICY "tenant_isolation_system_modules"
ON public.system_modules
FOR ALL
TO authenticated
USING (
  blueprint_id IN (
    SELECT id FROM system_blueprints WHERE tenant_id = get_user_tenant_id()
  )
)
WITH CHECK (
  blueprint_id IN (
    SELECT id FROM system_blueprints WHERE tenant_id = get_user_tenant_id()
  )
);

-- ============= SYSTEM RELATIONSHIPS =============
CREATE POLICY "tenant_isolation_system_relationships"
ON public.system_relationships
FOR ALL
TO authenticated
USING (
  blueprint_id IN (
    SELECT id FROM system_blueprints WHERE tenant_id = get_user_tenant_id()
  )
)
WITH CHECK (
  blueprint_id IN (
    SELECT id FROM system_blueprints WHERE tenant_id = get_user_tenant_id()
  )
);

-- ============= ARCHITECTURE PATTERNS =============
CREATE POLICY "tenant_isolation_architecture_patterns"
ON public.architecture_patterns
FOR ALL
TO authenticated
USING (
  blueprint_id IN (
    SELECT id FROM system_blueprints WHERE tenant_id = get_user_tenant_id()
  )
)
WITH CHECK (
  blueprint_id IN (
    SELECT id FROM system_blueprints WHERE tenant_id = get_user_tenant_id()
  )
);
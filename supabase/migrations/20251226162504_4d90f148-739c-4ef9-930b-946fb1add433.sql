-- =====================================================
-- FASE 4: Atualizar Função get_user_tenant_id e Outras Funções
-- =====================================================

-- 1. Atualizar get_user_tenant_id() com SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.get_user_tenant_id()
RETURNS UUID
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT tenant_id 
  FROM tenant_members 
  WHERE user_id = auth.uid() 
  LIMIT 1;
$$;

-- 2. Atualizar update_updated_at_column() com search_path
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

-- 3. Atualizar audit_log_function() com search_path
CREATE OR REPLACE FUNCTION public.audit_log_function()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;

-- 4. Atualizar update_profiles_updated_at() com search_path
CREATE OR REPLACE FUNCTION public.update_profiles_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- 5. Atualizar get_idea_stats() com search_path
CREATE OR REPLACE FUNCTION public.get_idea_stats(p_tenant_id UUID)
RETURNS TABLE(
  total INTEGER,
  conception_count INTEGER,
  validation_count INTEGER,
  structuring_count INTEGER,
  implementation_count INTEGER
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    COUNT(*)::INTEGER as total,
    COUNT(*) FILTER (WHERE current_phase = 'conception')::INTEGER as conception_count,
    COUNT(*) FILTER (WHERE current_phase = 'validation')::INTEGER as validation_count,
    COUNT(*) FILTER (WHERE current_phase = 'structuring')::INTEGER as structuring_count,
    COUNT(*) FILTER (WHERE current_phase = 'implementation')::INTEGER as implementation_count
  FROM ideas
  WHERE tenant_id = p_tenant_id;
$$;

-- 6. Atualizar get_client_summary() com search_path
CREATE OR REPLACE FUNCTION public.get_client_summary(p_client_id UUID)
RETURNS TABLE(
  client_name TEXT,
  total_contacts INTEGER,
  mapped_processes INTEGER,
  total_metrics INTEGER
)
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT
    c.name,
    COUNT(DISTINCT cc.id)::INTEGER,
    COUNT(DISTINCT cp.id)::INTEGER,
    COUNT(DISTINCT cm.id)::INTEGER
  FROM clients c
  LEFT JOIN client_contacts cc ON c.id = cc.client_id
  LEFT JOIN client_processes cp ON c.id = cp.client_id
  LEFT JOIN client_metrics cm ON c.id = cm.client_id
  WHERE c.id = p_client_id
  GROUP BY c.name;
$$;
-- =====================================================
-- Habilitar RLS nas Tabelas que Ainda Não Têm
-- =====================================================

-- Habilitar RLS em todas as tabelas secundárias
ALTER TABLE public.client_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_actions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.flow_executions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.idea_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_dependencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.module_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.n8n_workflows_sync ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.process_flows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.secret_access_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.architecture_patterns ENABLE ROW LEVEL SECURITY;
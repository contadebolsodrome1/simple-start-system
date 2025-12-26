export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      architecture_patterns: {
        Row: {
          blueprint_id: string
          created_at: string | null
          description: string | null
          id: string
          implementation_details: Json | null
          pattern_name: string | null
        }
        Insert: {
          blueprint_id: string
          created_at?: string | null
          description?: string | null
          id?: string
          implementation_details?: Json | null
          pattern_name?: string | null
        }
        Update: {
          blueprint_id?: string
          created_at?: string | null
          description?: string | null
          id?: string
          implementation_details?: Json | null
          pattern_name?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "architecture_patterns_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "system_blueprints"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_logs: {
        Row: {
          action: string | null
          changes: Json | null
          created_at: string | null
          entity_id: string | null
          entity_type: string | null
          id: string
          ip_address: string | null
          tenant_id: string
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          action?: string | null
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          tenant_id: string
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          action?: string | null
          changes?: Json | null
          created_at?: string | null
          entity_id?: string | null
          entity_type?: string | null
          id?: string
          ip_address?: string | null
          tenant_id?: string
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_flows: {
        Row: {
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          n8n_workflow_id: string | null
          n8n_workflow_name: string | null
          name: string
          status: string | null
          tenant_id: string
          trigger_config: Json | null
          trigger_type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          n8n_workflow_id?: string | null
          n8n_workflow_name?: string | null
          name: string
          status?: string | null
          tenant_id: string
          trigger_config?: Json | null
          trigger_type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          n8n_workflow_id?: string | null
          n8n_workflow_name?: string | null
          name?: string
          status?: string | null
          tenant_id?: string
          trigger_config?: Json | null
          trigger_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "automation_flows_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      client_contacts: {
        Row: {
          client_id: string
          created_at: string | null
          email: string | null
          id: string
          is_primary: boolean | null
          name: string
          phone: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          client_id: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string | null
          email?: string | null
          id?: string
          is_primary?: boolean | null
          name?: string
          phone?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_contacts_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_metrics: {
        Row: {
          client_id: string
          id: string
          measured_at: string | null
          metric_name: string
          metric_value: number | null
          period: string | null
        }
        Insert: {
          client_id: string
          id?: string
          measured_at?: string | null
          metric_name: string
          metric_value?: number | null
          period?: string | null
        }
        Update: {
          client_id?: string
          id?: string
          measured_at?: string | null
          metric_name?: string
          metric_value?: number | null
          period?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_metrics_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      client_processes: {
        Row: {
          client_id: string
          id: string
          mapped_at: string | null
          process_id: string | null
          status: string | null
        }
        Insert: {
          client_id: string
          id?: string
          mapped_at?: string | null
          process_id?: string | null
          status?: string | null
        }
        Update: {
          client_id?: string
          id?: string
          mapped_at?: string | null
          process_id?: string | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_processes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "client_processes_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      client_teams: {
        Row: {
          client_id: string
          created_at: string | null
          department: string | null
          description: string | null
          id: string
          name: string
        }
        Insert: {
          client_id: string
          created_at?: string | null
          department?: string | null
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          client_id?: string
          created_at?: string | null
          department?: string | null
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "client_teams_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          cnpj: string | null
          created_at: string | null
          id: string
          industry: string | null
          name: string
          notes: string | null
          status: string | null
          tenant_id: string
          updated_at: string | null
          website: string | null
        }
        Insert: {
          cnpj?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          name: string
          notes?: string | null
          status?: string | null
          tenant_id: string
          updated_at?: string | null
          website?: string | null
        }
        Update: {
          cnpj?: string | null
          created_at?: string | null
          id?: string
          industry?: string | null
          name?: string
          notes?: string | null
          status?: string | null
          tenant_id?: string
          updated_at?: string | null
          website?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "clients_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      event_logs: {
        Row: {
          created_at: string | null
          event_type: string | null
          id: string
          payload: Json | null
          processed: boolean | null
          processed_at: string | null
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          event_type?: string | null
          id?: string
          payload?: Json | null
          processed?: boolean | null
          processed_at?: string | null
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          event_type?: string | null
          id?: string
          payload?: Json | null
          processed?: boolean | null
          processed_at?: string | null
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_logs_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_actions: {
        Row: {
          action_config: Json | null
          action_type: string | null
          automation_flow_id: string
          created_at: string | null
          id: string
          order_index: number | null
        }
        Insert: {
          action_config?: Json | null
          action_type?: string | null
          automation_flow_id: string
          created_at?: string | null
          id?: string
          order_index?: number | null
        }
        Update: {
          action_config?: Json | null
          action_type?: string | null
          automation_flow_id?: string
          created_at?: string | null
          id?: string
          order_index?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "flow_actions_automation_flow_id_fkey"
            columns: ["automation_flow_id"]
            isOneToOne: false
            referencedRelation: "automation_flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flow_actions_automation_flow_id_fkey"
            columns: ["automation_flow_id"]
            isOneToOne: false
            referencedRelation: "automations_status"
            referencedColumns: ["id"]
          },
        ]
      }
      flow_executions: {
        Row: {
          automation_flow_id: string
          completed_at: string | null
          duration_ms: number | null
          error_message: string | null
          executed_at: string | null
          id: string
          input_data: Json | null
          n8n_execution_id: string | null
          output_data: Json | null
          status: string | null
        }
        Insert: {
          automation_flow_id: string
          completed_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          input_data?: Json | null
          n8n_execution_id?: string | null
          output_data?: Json | null
          status?: string | null
        }
        Update: {
          automation_flow_id?: string
          completed_at?: string | null
          duration_ms?: number | null
          error_message?: string | null
          executed_at?: string | null
          id?: string
          input_data?: Json | null
          n8n_execution_id?: string | null
          output_data?: Json | null
          status?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flow_executions_automation_flow_id_fkey"
            columns: ["automation_flow_id"]
            isOneToOne: false
            referencedRelation: "automation_flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "flow_executions_automation_flow_id_fkey"
            columns: ["automation_flow_id"]
            isOneToOne: false
            referencedRelation: "automations_status"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_attachments: {
        Row: {
          created_at: string | null
          file_name: string
          file_size: number | null
          file_url: string
          id: string
          idea_id: string
          mime_type: string | null
          uploaded_by: string
        }
        Insert: {
          created_at?: string | null
          file_name: string
          file_size?: number | null
          file_url: string
          id?: string
          idea_id: string
          mime_type?: string | null
          uploaded_by: string
        }
        Update: {
          created_at?: string | null
          file_name?: string
          file_size?: number | null
          file_url?: string
          id?: string
          idea_id?: string
          mime_type?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_attachments_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_attachments_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas_dashboard"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_documents: {
        Row: {
          content: string | null
          created_at: string | null
          created_by: string
          doc_type: string | null
          id: string
          idea_id: string
          title: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          created_by: string
          doc_type?: string | null
          id?: string
          idea_id: string
          title: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          created_by?: string
          doc_type?: string | null
          id?: string
          idea_id?: string
          title?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "idea_documents_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_documents_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas_dashboard"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_phases: {
        Row: {
          assignee_id: string | null
          completed_at: string | null
          created_at: string | null
          id: string
          idea_id: string
          notes: string | null
          phase_type: string
          started_at: string | null
        }
        Insert: {
          assignee_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          idea_id: string
          notes?: string | null
          phase_type: string
          started_at?: string | null
        }
        Update: {
          assignee_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          id?: string
          idea_id?: string
          notes?: string | null
          phase_type?: string
          started_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "idea_phases_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_phases_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas_dashboard"
            referencedColumns: ["id"]
          },
        ]
      }
      idea_tags: {
        Row: {
          created_at: string | null
          id: string
          idea_id: string
          tag: string
          tenant_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          idea_id: string
          tag: string
          tenant_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          idea_id?: string
          tag?: string
          tenant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "idea_tags_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_tags_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "idea_tags_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      ideas: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string
          current_phase: string | null
          description: string | null
          id: string
          status: string | null
          tenant_id: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by: string
          current_phase?: string | null
          description?: string | null
          id?: string
          status?: string | null
          tenant_id: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string
          current_phase?: string | null
          description?: string | null
          id?: string
          status?: string | null
          tenant_id?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ideas_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      module_dependencies: {
        Row: {
          created_at: string | null
          depends_on_module_id: string
          id: string
          module_template_id: string
          version_constraint: string | null
        }
        Insert: {
          created_at?: string | null
          depends_on_module_id: string
          id?: string
          module_template_id: string
          version_constraint?: string | null
        }
        Update: {
          created_at?: string | null
          depends_on_module_id?: string
          id?: string
          module_template_id?: string
          version_constraint?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_dependencies_depends_on_module_id_fkey"
            columns: ["depends_on_module_id"]
            isOneToOne: false
            referencedRelation: "module_templates"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "module_dependencies_module_template_id_fkey"
            columns: ["module_template_id"]
            isOneToOne: false
            referencedRelation: "module_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      module_templates: {
        Row: {
          category: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          is_public: boolean | null
          name: string
          tenant_id: string | null
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          is_public?: boolean | null
          name?: string
          tenant_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_templates_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      module_versions: {
        Row: {
          created_at: string | null
          description: string | null
          documentation: string | null
          example_code: string | null
          id: string
          module_template_id: string
          specification: Json | null
          version_number: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          documentation?: string | null
          example_code?: string | null
          id?: string
          module_template_id: string
          specification?: Json | null
          version_number?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          documentation?: string | null
          example_code?: string | null
          id?: string
          module_template_id?: string
          specification?: Json | null
          version_number?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "module_versions_module_template_id_fkey"
            columns: ["module_template_id"]
            isOneToOne: false
            referencedRelation: "module_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_integrations: {
        Row: {
          api_key_encrypted: string
          api_key_hash: string
          base_url: string
          created_at: string | null
          error_message: string | null
          id: string
          last_sync: string | null
          status: string | null
          sync_count: number | null
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          api_key_encrypted: string
          api_key_hash: string
          base_url: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          last_sync?: string | null
          status?: string | null
          sync_count?: number | null
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          api_key_encrypted?: string
          api_key_hash?: string
          base_url?: string
          created_at?: string | null
          error_message?: string | null
          id?: string
          last_sync?: string | null
          status?: string | null
          sync_count?: number | null
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "n8n_integrations_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: true
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      n8n_workflows_sync: {
        Row: {
          created_at: string | null
          dromeflow_automation_id: string | null
          id: string
          last_synced: string | null
          n8n_active: boolean | null
          n8n_workflow_id: string
          n8n_workflow_name: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dromeflow_automation_id?: string | null
          id?: string
          last_synced?: string | null
          n8n_active?: boolean | null
          n8n_workflow_id: string
          n8n_workflow_name: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dromeflow_automation_id?: string | null
          id?: string
          last_synced?: string | null
          n8n_active?: boolean | null
          n8n_workflow_id?: string
          n8n_workflow_name?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "n8n_workflows_sync_dromeflow_automation_id_fkey"
            columns: ["dromeflow_automation_id"]
            isOneToOne: false
            referencedRelation: "automation_flows"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "n8n_workflows_sync_dromeflow_automation_id_fkey"
            columns: ["dromeflow_automation_id"]
            isOneToOne: false
            referencedRelation: "automations_status"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "n8n_workflows_sync_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      process_flows: {
        Row: {
          automation_potential: string | null
          created_at: string | null
          estimated_savings_percent: number | null
          flow_diagram: Json | null
          id: string
          process_id: string
          updated_at: string | null
        }
        Insert: {
          automation_potential?: string | null
          created_at?: string | null
          estimated_savings_percent?: number | null
          flow_diagram?: Json | null
          id?: string
          process_id: string
          updated_at?: string | null
        }
        Update: {
          automation_potential?: string | null
          created_at?: string | null
          estimated_savings_percent?: number | null
          flow_diagram?: Json | null
          id?: string
          process_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "process_flows_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      process_steps: {
        Row: {
          actor: string | null
          created_at: string | null
          description: string | null
          duration_minutes: number | null
          id: string
          is_automatable: boolean | null
          output_data: Json | null
          process_id: string
          required_data: Json | null
          step_number: number
          title: string
        }
        Insert: {
          actor?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_automatable?: boolean | null
          output_data?: Json | null
          process_id: string
          required_data?: Json | null
          step_number: number
          title: string
        }
        Update: {
          actor?: string | null
          created_at?: string | null
          description?: string | null
          duration_minutes?: number | null
          id?: string
          is_automatable?: boolean | null
          output_data?: Json | null
          process_id?: string
          required_data?: Json | null
          step_number?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "process_steps_process_id_fkey"
            columns: ["process_id"]
            isOneToOne: false
            referencedRelation: "processes"
            referencedColumns: ["id"]
          },
        ]
      }
      processes: {
        Row: {
          category: string | null
          complexity: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          name: string
          tenant_id: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          complexity?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          name: string
          tenant_id: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          complexity?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          name?: string
          tenant_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "processes_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          first_name: string | null
          id: string
          last_name: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      secret_access_log: {
        Row: {
          accessed_at: string | null
          action: string | null
          id: string
          ip_address: string | null
          secret_id: string
          user_id: string
        }
        Insert: {
          accessed_at?: string | null
          action?: string | null
          id?: string
          ip_address?: string | null
          secret_id: string
          user_id: string
        }
        Update: {
          accessed_at?: string | null
          action?: string | null
          id?: string
          ip_address?: string | null
          secret_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "secret_access_log_secret_id_fkey"
            columns: ["secret_id"]
            isOneToOne: false
            referencedRelation: "secrets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "secret_access_log_secret_id_fkey"
            columns: ["secret_id"]
            isOneToOne: false
            referencedRelation: "secrets_expiring_soon"
            referencedColumns: ["id"]
          },
        ]
      }
      secrets: {
        Row: {
          access_count: number | null
          client_id: string | null
          created_at: string | null
          created_by: string
          description: string | null
          expires_at: string | null
          id: string
          key_type: string
          last_accessed_at: string | null
          name: string
          notes: string | null
          status: string | null
          tags: string[] | null
          tenant_id: string
          tool: string
          updated_at: string | null
          used_in: string[] | null
          value_encrypted: string
          value_hash: string
          visibility: string | null
        }
        Insert: {
          access_count?: number | null
          client_id?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          expires_at?: string | null
          id?: string
          key_type: string
          last_accessed_at?: string | null
          name: string
          notes?: string | null
          status?: string | null
          tags?: string[] | null
          tenant_id: string
          tool: string
          updated_at?: string | null
          used_in?: string[] | null
          value_encrypted: string
          value_hash: string
          visibility?: string | null
        }
        Update: {
          access_count?: number | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          expires_at?: string | null
          id?: string
          key_type?: string
          last_accessed_at?: string | null
          name?: string
          notes?: string | null
          status?: string | null
          tags?: string[] | null
          tenant_id?: string
          tool?: string
          updated_at?: string | null
          used_in?: string[] | null
          value_encrypted?: string
          value_hash?: string
          visibility?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "secrets_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      system_blueprints: {
        Row: {
          architecture_type: string | null
          client_id: string | null
          created_at: string | null
          created_by: string
          description: string | null
          id: string
          idea_id: string | null
          name: string
          status: string | null
          tenant_id: string
          updated_at: string | null
          version: number | null
        }
        Insert: {
          architecture_type?: string | null
          client_id?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          id?: string
          idea_id?: string | null
          name: string
          status?: string | null
          tenant_id: string
          updated_at?: string | null
          version?: number | null
        }
        Update: {
          architecture_type?: string | null
          client_id?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          id?: string
          idea_id?: string | null
          name?: string
          status?: string | null
          tenant_id?: string
          updated_at?: string | null
          version?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "system_blueprints_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_blueprints_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_blueprints_idea_id_fkey"
            columns: ["idea_id"]
            isOneToOne: false
            referencedRelation: "ideas_dashboard"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_blueprints_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      system_entities: {
        Row: {
          blueprint_id: string
          created_at: string | null
          description: string | null
          entity_name: string
          entity_type: string | null
          fields: Json | null
          id: string
        }
        Insert: {
          blueprint_id: string
          created_at?: string | null
          description?: string | null
          entity_name: string
          entity_type?: string | null
          fields?: Json | null
          id?: string
        }
        Update: {
          blueprint_id?: string
          created_at?: string | null
          description?: string | null
          entity_name?: string
          entity_type?: string | null
          fields?: Json | null
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_entities_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "system_blueprints"
            referencedColumns: ["id"]
          },
        ]
      }
      system_modules: {
        Row: {
          blueprint_id: string
          created_at: string | null
          id: string
          integration_config: Json | null
          module_template_id: string
        }
        Insert: {
          blueprint_id: string
          created_at?: string | null
          id?: string
          integration_config?: Json | null
          module_template_id: string
        }
        Update: {
          blueprint_id?: string
          created_at?: string | null
          id?: string
          integration_config?: Json | null
          module_template_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_modules_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "system_blueprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_modules_module_template_id_fkey"
            columns: ["module_template_id"]
            isOneToOne: false
            referencedRelation: "module_templates"
            referencedColumns: ["id"]
          },
        ]
      }
      system_relationships: {
        Row: {
          blueprint_id: string
          created_at: string | null
          from_entity_id: string
          id: string
          relationship_type: string | null
          to_entity_id: string
        }
        Insert: {
          blueprint_id: string
          created_at?: string | null
          from_entity_id: string
          id?: string
          relationship_type?: string | null
          to_entity_id: string
        }
        Update: {
          blueprint_id?: string
          created_at?: string | null
          from_entity_id?: string
          id?: string
          relationship_type?: string | null
          to_entity_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "system_relationships_blueprint_id_fkey"
            columns: ["blueprint_id"]
            isOneToOne: false
            referencedRelation: "system_blueprints"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_relationships_from_entity_id_fkey"
            columns: ["from_entity_id"]
            isOneToOne: false
            referencedRelation: "system_entities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "system_relationships_to_entity_id_fkey"
            columns: ["to_entity_id"]
            isOneToOne: false
            referencedRelation: "system_entities"
            referencedColumns: ["id"]
          },
        ]
      }
      tenant_members: {
        Row: {
          created_at: string | null
          email: string
          id: string
          role: string | null
          tenant_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email: string
          id?: string
          role?: string | null
          tenant_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string
          id?: string
          role?: string | null
          tenant_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tenant_members_tenant_id_fkey"
            columns: ["tenant_id"]
            isOneToOne: false
            referencedRelation: "tenants"
            referencedColumns: ["id"]
          },
        ]
      }
      tenants: {
        Row: {
          billing_email: string | null
          created_at: string | null
          id: string
          name: string
          plan: string | null
          slug: string
          status: string | null
          subscription_id: string | null
          updated_at: string | null
        }
        Insert: {
          billing_email?: string | null
          created_at?: string | null
          id?: string
          name: string
          plan?: string | null
          slug: string
          status?: string | null
          subscription_id?: string | null
          updated_at?: string | null
        }
        Update: {
          billing_email?: string | null
          created_at?: string | null
          id?: string
          name?: string
          plan?: string | null
          slug?: string
          status?: string | null
          subscription_id?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      automations_status: {
        Row: {
          failed_executions: number | null
          id: string | null
          name: string | null
          status: string | null
          success_rate: number | null
          successful_executions: number | null
          total_executions: number | null
        }
        Relationships: []
      }
      ideas_dashboard: {
        Row: {
          created_at: string | null
          current_phase: string | null
          id: string | null
          title: string | null
          total_attachments: number | null
          total_phases: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      secrets_expiring_soon: {
        Row: {
          days_until_expiry: number | null
          expires_at: string | null
          id: string | null
          name: string | null
          tool: string | null
        }
        Insert: {
          days_until_expiry?: never
          expires_at?: string | null
          id?: string | null
          name?: string | null
          tool?: string | null
        }
        Update: {
          days_until_expiry?: never
          expires_at?: string | null
          id?: string | null
          name?: string | null
          tool?: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_client_summary: {
        Args: { p_client_id: string }
        Returns: {
          client_name: string
          mapped_processes: number
          total_contacts: number
          total_metrics: number
        }[]
      }
      get_idea_stats: {
        Args: { p_tenant_id: string }
        Returns: {
          conception_count: number
          implementation_count: number
          structuring_count: number
          total: number
          validation_count: number
        }[]
      }
      get_user_roles: {
        Args: { _user_id: string }
        Returns: Database["public"]["Enums"]["app_role"][]
      }
      get_user_tenant_id: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "super_admin" | "admin" | "manager" | "analyst" | "viewer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["super_admin", "admin", "manager", "analyst", "viewer"],
    },
  },
} as const

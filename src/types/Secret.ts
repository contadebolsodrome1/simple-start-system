export type KeyType =
  | "api_key"
  | "token"
  | "password"
  | "connection_string"
  | "oauth"
  | "webhook_secret"
  | "private_key"
  | "service_role_key"
  | "access_token";

export type SecretStatus = "active" | "inactive" | "revoked" | "expired";

export type ToolId =
  | "stripe"
  | "n8n"
  | "evolution"
  | "supabase"
  | "sendgrid"
  | "mercado_pago"
  | "typebot"
  | string;

export type TagId =
  | "producao"
  | "staging"
  | "teste"
  | "deprecated"
  | "critical"
  | "backup"
  | string;

export interface Secret {
  id: string;
  name: string;
  description?: string;
  tool: ToolId;
  key_type: KeyType;
  value: string; // criptografado ou mascarado
  value_hash?: string; // para validação sem revelar valor
  tags: TagId[];
  client_id: string; // "generico" ou client UUID
  status: SecretStatus;
  expires_at?: Date | null;
  created_at: Date;
  updated_at: Date;
  created_by: string; // user_id
  last_accessed_at?: Date;
  access_count?: number;
  notes?: string;
  used_in?: string[]; // IDs de automações que usam
  visibility: "hidden" | "masked" | "visible"; // padrão: masked
}

export interface Tool {
  id: ToolId;
  name: string;
  icon: string;
  key_types: KeyType[];
  color: string;
  description: string;
  docs_url: string;
}

export interface Tag {
  id: TagId;
  name: string;
  color: string;
  description: string;
}

export interface KeysState {
  secrets: Secret[];
  tools: Tool[];
  tags: Tag[];
  filters: {
    tool?: ToolId;
    tags?: TagId[];
    client_id?: string;
    showExpired?: boolean;
    showInactive?: boolean;
    searchQuery?: string;
  };
}

export interface UseKeysReturn {
  secrets: Secret[];
  filteredSecrets: Secret[];
  createSecret: (data: Omit<Secret, "id" | "created_at" | "updated_at">) => void;
  updateSecret: (id: string, patch: Partial<Secret>) => void;
  deleteSecret: (id: string) => void;
  copyToClipboard: (id: string) => Promise<void>;
  revealSecret: (id: string) => void;
  hideSecret: (id: string) => void;
  setFilters: (filters: Partial<KeysState["filters"]>) => void;
  exportSecrets: (password: string) => void;
  importSecrets: (file: File, password: string) => void;
  getSecretStats: () => {
    total: number;
    expiringIn7Days: number;
    expired: number;
    inactive: number;
  };
}

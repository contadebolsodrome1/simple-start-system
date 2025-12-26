export type ClientStatus = "active" | "inactive" | "prospect";

export interface ClientContact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "Principal" | "Secundário";
}

export interface Client {
  id: string;
  name: string;
  cnpj?: string;
  industry?: string;
  website?: string;
  status: ClientStatus;
  contacts: ClientContact[];
  notes?: string;
  created_at: string; // YYYY-MM-DD
}

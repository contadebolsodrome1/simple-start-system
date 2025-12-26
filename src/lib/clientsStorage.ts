import type { Client } from "@/types/client";

const STORAGE_KEY = "clients";

interface ClientsStore {
  clients: Client[];
}

export function loadClients(): Client[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ClientsStore | Client[];
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray((parsed as ClientsStore).clients)) return (parsed as ClientsStore).clients;
    return [];
  } catch {
    return [];
  }
}

export function saveClients(clients: Client[]) {
  if (typeof window === "undefined") return;
  const payload: ClientsStore = { clients };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

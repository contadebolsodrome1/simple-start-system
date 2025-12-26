import type { KeysState, Secret } from "@/types/Secret";

const STORAGE_KEY = "secrets_store";

type PersistedSecret = Omit<Secret, "created_at" | "updated_at" | "expires_at" | "last_accessed_at"> & {
  created_at: string;
  updated_at: string;
  expires_at?: string | null;
  last_accessed_at?: string;
};

interface PersistedState {
  secrets: PersistedSecret[];
  tools: KeysState["tools"];
  tags: KeysState["tags"];
}

export function loadSecretsState(): KeysState {
  if (typeof window === "undefined") {
    return { secrets: [], tools: [], tags: [], filters: {} };
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return { secrets: [], tools: [], tags: [], filters: {} };
  }

  try {
    const parsed = JSON.parse(raw) as PersistedState;
    const secrets: Secret[] = (parsed.secrets ?? []).map((s) => ({
      ...s,
      created_at: new Date(s.created_at),
      updated_at: new Date(s.updated_at),
      expires_at: s.expires_at ? new Date(s.expires_at) : null,
      last_accessed_at: s.last_accessed_at ? new Date(s.last_accessed_at) : undefined,
    }));

    return {
      secrets,
      tools: parsed.tools ?? [],
      tags: parsed.tags ?? [],
      filters: {},
    };
  } catch {
    return { secrets: [], tools: [], tags: [], filters: {} };
  }
}

export function saveSecretsState(state: KeysState) {
  if (typeof window === "undefined") return;
  const persisted: PersistedState = {
    secrets: state.secrets.map((s) => ({
      ...s,
      created_at: s.created_at.toISOString(),
      updated_at: s.updated_at.toISOString(),
      expires_at: s.expires_at ? s.expires_at.toISOString() : null,
      last_accessed_at: s.last_accessed_at ? s.last_accessed_at.toISOString() : undefined,
    })),
    tools: state.tools,
    tags: state.tags,
  };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
}

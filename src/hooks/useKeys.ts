import { useCallback, useEffect, useMemo, useState } from "react";
import type { KeysState, Secret, UseKeysReturn } from "@/types/Secret";
import { loadSecretsState, saveSecretsState } from "@/lib/keysStorage";
import { Permissions } from "@/lib/roles";
import { toast } from "@/components/ui/use-toast";
import { useAuth } from "@/context/AuthContext";

function maskValue(value: string): string {
  if (!value) return "";
  const visibleStart = value.slice(0, 4);
  const visibleEnd = value.slice(-4);
  const middle = Math.max(value.length - 8, 4);
  return `${visibleStart}${"•".repeat(middle)}${visibleEnd}`;
}

function simpleHash(input: string): string {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return `h${Math.abs(hash)}`;
}

export function useKeys(): UseKeysReturn {
  const { userRole } = useAuth();
  const [state, setState] = useState<KeysState>(() => loadSecretsState());

  useEffect(() => {
    saveSecretsState(state);
  }, [state]);

  const setFilters: UseKeysReturn["setFilters"] = (filters) => {
    setState((prev) => ({ ...prev, filters: { ...prev.filters, ...filters } }));
  };

  const createSecret: UseKeysReturn["createSecret"] = (data) => {
    if (!userRole || !Permissions.canManageSecrets(userRole)) {
      toast({ title: "Sem permissão", description: "Seu papel não permite criar secrets.", variant: "destructive" });
      return;
    }
    const now = new Date();
    const id = crypto.randomUUID();
    const secret: Secret = {
      ...data,
      id,
      created_at: now,
      updated_at: now,
      value_hash: data.value ? simpleHash(data.value) : undefined,
      visibility: data.visibility ?? "masked",
    };
    setState((prev) => ({ ...prev, secrets: [secret, ...prev.secrets] }));
  };

  const updateSecret: UseKeysReturn["updateSecret"] = (id, patch) => {
    if (!userRole || !Permissions.canManageSecrets(userRole)) {
      toast({ title: "Sem permissão", description: "Seu papel não permite editar secrets.", variant: "destructive" });
      return;
    }
    setState((prev) => ({
      ...prev,
      secrets: prev.secrets.map((s) => {
        if (s.id !== id) return s;
        const next: Secret = {
          ...s,
          ...patch,
          updated_at: new Date(),
        };
        if (patch.value) {
          next.value_hash = simpleHash(patch.value);
        }
        return next;
      }),
    }));
  };

  const deleteSecret: UseKeysReturn["deleteSecret"] = (id) => {
    if (!userRole || !Permissions.canManageSecrets(userRole)) {
      toast({ title: "Sem permissão", description: "Seu papel não permite deletar secrets.", variant: "destructive" });
      return;
    }
    setState((prev) => ({ ...prev, secrets: prev.secrets.filter((s) => s.id !== id) }));
  };

  const copyToClipboard: UseKeysReturn["copyToClipboard"] = async (id) => {
    const secret = state.secrets.find((s) => s.id === id);
    if (!secret) return;
    if (!userRole || !Permissions.canViewSecrets(userRole)) {
      toast({ title: "Sem permissão", description: "Seu papel não permite copiar secrets.", variant: "destructive" });
      return;
    }
    try {
      await navigator.clipboard.writeText(secret.value);
      setState((prev) => ({
        ...prev,
        secrets: prev.secrets.map((s) =>
          s.id === id
            ? {
                ...s,
                last_accessed_at: new Date(),
                access_count: (s.access_count ?? 0) + 1,
              }
            : s,
        ),
      }));
      toast({ title: "Copiado", description: "Valor copiado para a área de transferência." });
    } catch {
      toast({ title: "Erro ao copiar", description: "Verifique as permissões do navegador.", variant: "destructive" });
    }
  };

  const revealSecret: UseKeysReturn["revealSecret"] = (id) => {
    if (!userRole || !Permissions.canViewSecrets(userRole)) {
      toast({ title: "Sem permissão", description: "Seu papel não permite revelar secrets.", variant: "destructive" });
      return;
    }
    setState((prev) => ({
      ...prev,
      secrets: prev.secrets.map((s) => (s.id === id ? { ...s, visibility: "visible" } : s)),
    }));
  };

  const hideSecret: UseKeysReturn["hideSecret"] = (id) => {
    setState((prev) => ({
      ...prev,
      secrets: prev.secrets.map((s) => (s.id === id ? { ...s, visibility: "masked" } : s)),
    }));
  };

  const filteredSecrets = useMemo(() => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    return state.secrets.filter((s) => {
      if (!userRole || !Permissions.canViewSecrets(userRole)) return false;

      const { tool, tags, client_id, showExpired, showInactive, searchQuery } = state.filters;

      if (tool && s.tool !== tool) return false;
      if (client_id && s.client_id !== client_id) return false;
      if (tags && tags.length > 0 && !tags.every((t) => s.tags.includes(t))) return false;

      if (!showInactive && (s.status === "inactive" || s.status === "revoked")) return false;

      const isExpired = s.expires_at ? s.expires_at < now : false;
      if (!showExpired && isExpired) return false;

      if (searchQuery && searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const haystack = [
          s.name,
          s.description ?? "",
          s.tool,
          s.client_id,
          s.tags.join(" "),
          s.notes ?? "",
        ]
          .join(" ")
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      // Marca expirados automaticamente no status simulado
      if (s.expires_at && s.expires_at < now && s.status !== "expired") {
        s.status = "expired";
      }

      return true;
    });
  }, [state.secrets, state.filters, userRole]);

  const getSecretStats: UseKeysReturn["getSecretStats"] = () => {
    const now = new Date();
    const sevenDaysFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);

    const total = state.secrets.length;
    const expiringIn7Days = state.secrets.filter(
      (s) => s.expires_at && s.expires_at >= now && s.expires_at <= sevenDaysFromNow,
    ).length;
    const expired = state.secrets.filter((s) => s.expires_at && s.expires_at < now).length;
    const inactive = state.secrets.filter((s) => s.status === "inactive" || s.status === "revoked").length;

    return { total, expiringIn7Days, expired, inactive };
  };

  const exportSecrets: UseKeysReturn["exportSecrets"] = (password) => {
    // Simulado: password não é usado de fato, apenas incluído no aviso
    const payload = JSON.stringify({ secrets: state.secrets }, null, 2);
    const blob = new Blob([payload], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "dromeflow-secrets-export.json";
    a.click();
    URL.revokeObjectURL(url);
    toast({
      title: "Exportação gerada",
      description: `Arquivo JSON simulado criado. Proteja-o com senha fora do sistema (${password ? "senha informada" : "defina uma senha"}).`,
    });
  };

  const importSecrets: UseKeysReturn["importSecrets"] = async (file, _password) => {
    // Simulado: _password não é usado; apenas leitura direta
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as { secrets?: Secret[] };
      if (!parsed.secrets || !Array.isArray(parsed.secrets)) throw new Error("Formato inválido");
      const existingIds = new Set(state.secrets.map((s) => s.id));
      const merged: Secret[] = [...state.secrets, ...parsed.secrets.filter((s) => !existingIds.has(s.id))].map((s) => ({
        ...s,
        created_at: new Date(s.created_at),
        updated_at: new Date(s.updated_at),
        expires_at: s.expires_at ? new Date(s.expires_at) : null,
        last_accessed_at: s.last_accessed_at ? new Date(s.last_accessed_at) : undefined,
      }));
      setState((prev) => ({ ...prev, secrets: merged }));
      toast({ title: "Importação concluída", description: "Chaves do arquivo foram adicionadas ao painel." });
    } catch {
      toast({ title: "Erro ao importar", description: "Verifique o arquivo JSON fornecido.", variant: "destructive" });
    }
  };

  return {
    secrets: state.secrets.map((s) => ({ ...s, value: s.visibility === "masked" ? maskValue(s.value) : s.value })),
    filteredSecrets,
    createSecret,
    updateSecret,
    deleteSecret,
    copyToClipboard,
    revealSecret,
    hideSecret,
    setFilters,
    exportSecrets,
    importSecrets,
    getSecretStats,
  };
}

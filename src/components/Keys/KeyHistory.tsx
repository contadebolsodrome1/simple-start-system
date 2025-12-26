import type { Secret } from "@/types/Secret";

interface KeyHistoryProps {
  secret: Secret | null;
}

export const KeyHistory = ({ secret }: KeyHistoryProps) => {
  if (!secret) return null;

  return (
    <div className="space-y-2 text-sm text-muted-foreground">
      <p>
        <span className="font-medium">Criada em:</span> {new Date(secret.created_at).toLocaleString()}
      </p>
      <p>
        <span className="font-medium">Última atualização:</span> {new Date(secret.updated_at).toLocaleString()}
      </p>
      <p>
        <span className="font-medium">Último acesso:</span>{" "}
        {secret.last_accessed_at ? new Date(secret.last_accessed_at).toLocaleString() : "—"}
      </p>
      <p>
        <span className="font-medium">Total de cópias:</span> {secret.access_count ?? 0}
      </p>
      <p>
        <span className="font-medium">Criada por:</span> {secret.created_by}
      </p>
    </div>
  );
};

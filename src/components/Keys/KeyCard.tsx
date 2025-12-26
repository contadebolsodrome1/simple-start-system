import type { Secret, Tool, Tag } from "@/types/Secret";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, Copy, Edit2, Trash2, History } from "lucide-react";
import { cn } from "@/lib/utils";

interface KeyCardProps {
  secret: Secret;
  tool?: Tool;
  tags?: Tag[];
  maskedValue: string;
  canEdit: boolean;
  canDelete: boolean;
  canSeeValue: boolean;
  onToggleVisibility: () => void;
  onCopy: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onShowHistory: () => void;
}

export const KeyCard = ({
  secret,
  tool,
  tags,
  maskedValue,
  canEdit,
  canDelete,
  canSeeValue,
  onToggleVisibility,
  onCopy,
  onEdit,
  onDelete,
  onShowHistory,
}: KeyCardProps) => {
  const tagBadges = (secret.tags || []).map((tagId) => tags?.find((t) => t.id === tagId) ?? { id: tagId, name: tagId, color: "" });

  const statusLabel =
    secret.status === "active" ? "Ativo" : secret.status === "inactive" ? "Inativo" : "Revogado";

  const isExpired = secret.expires_at ? new Date(secret.expires_at) < new Date() : false;
  const expiresSoon =
    secret.expires_at && !isExpired
      ? new Date(secret.expires_at) < new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      : false;

  return (
    <Card className="border-border/70 bg-card/80 transition hover:border-[hsl(var(--primary))] hover:bg-card/90">
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div className="space-y-1">
          <CardTitle className="text-sm font-semibold leading-snug flex items-center gap-2">
            <span>{secret.name}</span>
            {tool && (
              <span className="inline-flex items-center gap-1 rounded-full bg-[hsl(var(--accent)/0.35)] px-2 py-0.5 text-[10px] font-medium text-[hsl(var(--accent-foreground))]">
                <span>{tool.icon}</span>
                <span>{tool.name}</span>
              </span>
            )}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {secret.description || "Sem descrição"}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <Badge
            variant={secret.status === "active" ? "default" : "outline"}
            className={cn(
              "text-[10px] uppercase tracking-[0.16em]",
              secret.status !== "active" && "border-border/60 text-muted-foreground",
            )}
          >
            {statusLabel}
          </Badge>
          {isExpired && (
            <span className="text-[10px] font-medium text-[hsl(var(--destructive))]">Expirada</span>
          )}
          {!isExpired && expiresSoon && (
            <span className="text-[10px] text-[hsl(var(--destructive))]">
              Expira em breve
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3 pb-4">
        <div className="flex items-center justify-between gap-2 rounded-md bg-[hsl(var(--muted))] px-3 py-2">
          <code className="line-clamp-1 text-xs font-mono text-muted-foreground">
            {canSeeValue && secret.visibility === "visible" ? secret.value : maskedValue}
          </code>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={onToggleVisibility}
            >
              {secret.visibility === "visible" && canSeeValue ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7 text-muted-foreground hover:text-foreground"
              onClick={onCopy}
            >
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span className="rounded-full bg-[hsl(var(--secondary))] px-2 py-0.5">
            Tipo: <span className="font-medium">{secret.key_type}</span>
          </span>
          <span className="rounded-full bg-[hsl(var(--secondary))] px-2 py-0.5">
            Cliente: <span className="font-medium">{secret.client_id === "generico" ? "Genérico" : secret.client_id}</span>
          </span>
          {tagBadges.map((t) => (
            <Badge
              key={t.id}
              variant="outline"
              className="border-[hsl(var(--accent))] bg-[hsl(var(--accent)/0.25)] text-[10px] text-[hsl(var(--accent-foreground))]"
            >
              {t.name}
            </Badge>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-muted-foreground">
          <span>
            Criada em {new Date(secret.created_at).toLocaleString()} | Último acesso:{" "}
            {secret.last_accessed_at ? new Date(secret.last_accessed_at).toLocaleString() : "—"}
          </span>
          <span>Copiada {secret.access_count ?? 0}x</span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 text-xs text-muted-foreground hover:text-foreground"
            onClick={onShowHistory}
          >
            <History className="mr-1 h-3.5 w-3.5" /> Histórico
          </Button>
          <div className="flex items-center gap-1">
            {canEdit && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 px-2 text-xs"
                onClick={onEdit}
              >
                <Edit2 className="mr-1 h-3.5 w-3.5" /> Editar
              </Button>
            )}
            {canDelete && (
              <Button
                size="sm"
                variant="outline"
                className="h-7 border-[hsl(var(--destructive))] px-2 text-xs text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.08)]"
                onClick={onDelete}
              >
                <Trash2 className="mr-1 h-3.5 w-3.5" /> Deletar
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

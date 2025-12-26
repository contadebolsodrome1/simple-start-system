import type { Secret, Tool, Tag } from "@/types/Secret";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { KeyCard } from "./KeyCard";
import { Permissions } from "@/lib/roles";
import { useMemo } from "react";
import { useAuth } from "@/context/AuthContext";

interface KeysListProps {
  secrets: Secret[];
  tools: Tool[];
  tags: Tag[];
  onEdit: (secret: Secret) => void;
  onRequestDelete: (secret: Secret) => void;
  onShowHistory: (secret: Secret) => void;
  onToggleVisibility: (secret: Secret) => void;
  onCopy: (secret: Secret) => void;
}

function maskValue(value: string): string {
  if (!value) return "";
  const visibleStart = value.slice(0, 4);
  const visibleEnd = value.slice(-4);
  const middle = Math.max(value.length - 8, 4);
  return `${visibleStart}${"•".repeat(middle)}${visibleEnd}`;
}

export const KeysList = ({
  secrets,
  tools,
  tags,
  onEdit,
  onRequestDelete,
  onShowHistory,
  onToggleVisibility,
  onCopy,
}: KeysListProps) => {
  const { userRole } = useAuth();

  const grouped = useMemo(() => {
    const map = new Map<string, Secret[]>();
    for (const s of secrets) {
      const key = s.tool;
      const current = map.get(key) ?? [];
      current.push(s);
      map.set(key, current);
    }
    return Array.from(map.entries());
  }, [secrets]);

  if (grouped.length === 0) {
    return <p className="text-sm text-muted-foreground">Nenhuma chave encontrada com os filtros atuais.</p>;
  }

  return (
    <Accordion type="multiple" className="space-y-3">
      {grouped.map(([toolId, items]) => {
        const tool = tools.find((t) => t.id === toolId);
        const headerLabel = tool ? `${tool.icon} ${tool.name}` : toolId;

        return (
          <AccordionItem key={toolId} value={toolId} className="rounded-xl border border-border/70 bg-card/70 px-3">
            <AccordionTrigger className="flex items-center justify-between py-3 text-sm font-semibold">
              <div className="flex items-center gap-2">
                <span>{headerLabel}</span>
                <span className="text-xs text-muted-foreground">({items.length} chave(s))</span>
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3 pb-4">
              {items.map((secret) => {
                const masked = maskValue(secret.value);
                const canEdit = userRole ? Permissions.canManageSecrets(userRole) : false;
                const canDelete = userRole ? Permissions.canManageSecrets(userRole) : false;
                const canSeeValue = userRole ? Permissions.canViewSecrets(userRole) : false;

                return (
                  <KeyCard
                    key={secret.id}
                    secret={secret}
                    tool={tool}
                    tags={tags}
                    maskedValue={masked}
                    canEdit={canEdit}
                    canDelete={canDelete}
                    canSeeValue={canSeeValue}
                    onToggleVisibility={() => onToggleVisibility(secret)}
                    onCopy={() => onCopy(secret)}
                    onEdit={() => onEdit(secret)}
                    onDelete={() => onRequestDelete(secret)}
                    onShowHistory={() => onShowHistory(secret)}
                  />
                );
              })}
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

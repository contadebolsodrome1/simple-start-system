import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Client } from "@/types/client";
import { cn } from "@/lib/utils";

interface ClientCardProps {
  client: Client;
  onOpen: () => void;
}

const statusMeta: Record<Client["status"], { label: string; className: string }> = {
  active: {
    label: "Ativo",
    className:
      "bg-[hsl(var(--secondary)/0.18)] text-[hsl(var(--secondary-foreground))] border-[hsl(var(--secondary))]",
  },
  inactive: {
    label: "Inativo",
    className: "bg-muted text-muted-foreground border-transparent",
  },
  prospect: {
    label: "Prospect",
    className: "bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent-foreground))] border-[hsl(var(--accent))]",
  },
};

export function ClientCard({ client, onOpen }: ClientCardProps) {
  const statusInfo = statusMeta[client.status];

  return (
    <Card
      className="df-stat-card cursor-pointer transition-shadow hover:shadow-[0_16px_45px_-20px_hsl(var(--df-shadow-strong))]"
      onClick={onOpen}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-base font-semibold leading-snug">{client.name}</CardTitle>
          {client.industry && (
            <p className="mt-1 text-xs text-muted-foreground">{client.industry}</p>
          )}
        </div>
        <Badge className={cn("border px-2 py-0.5 text-xs", statusInfo.className)}>{statusInfo.label}</Badge>
      </CardHeader>
      <CardContent className="space-y-2 pb-4 text-xs text-muted-foreground">
        {client.cnpj && <p>CNPJ: {client.cnpj}</p>}
        {client.website && (
          <p className="truncate">
            Website: <span className="text-foreground">{client.website}</span>
          </p>
        )}
        <p>Criado em: {client.created_at}</p>
        {client.contacts.length > 0 && (
          <p>{client.contacts.length} contato(s) cadastrado(s)</p>
        )}
      </CardContent>
    </Card>
  );
}

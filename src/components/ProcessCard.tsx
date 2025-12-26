import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Process } from "@/types/process";
import { cn } from "@/lib/utils";

interface ProcessCardProps {
  process: Process;
  onOpen: () => void;
}

const complexityMeta: Record<Process["analysis"]["complexity"], { label: string; className: string }> = {
  LOW: {
    label: "Baixa",
    className: "bg-[hsl(var(--secondary)/0.2)] text-[hsl(var(--secondary-foreground))] border-[hsl(var(--secondary)/0.6)]",
  },
  MEDIUM: {
    label: "Média",
    className: "bg-[hsl(var(--accent)/0.18)] text-[hsl(var(--accent-foreground))] border-[hsl(var(--accent)/0.6)]",
  },
  HIGH: {
    label: "Alta",
    className: "bg-[hsl(var(--primary)/0.18)] text-[hsl(var(--primary))] border-[hsl(var(--primary)/0.6)]",
  },
};

export function ProcessCard({ process, onOpen }: ProcessCardProps) {
  const complexityInfo = complexityMeta[process.analysis.complexity];

  return (
    <Card
      className="df-stat-card cursor-pointer transition-shadow hover:shadow-[0_16px_45px_-20px_hsl(var(--df-shadow-strong))]"
      onClick={onOpen}
    >
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-3">
        <div>
          <CardTitle className="text-base font-semibold leading-snug">{process.name}</CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            {process.category.charAt(0).toUpperCase() + process.category.slice(1)} • {process.client_name}
          </p>
        </div>
        <Badge className={cn("border px-2 py-0.5 text-xs", complexityInfo.className)}>
          {complexityInfo.label}
        </Badge>
      </CardHeader>
      <CardContent className="space-y-2 pb-4 text-xs text-muted-foreground">
        <p>{process.description || "Sem descrição detalhada ainda."}</p>
        <p>
          {process.analysis.total_steps} passo(s) • Potencial de automação: {process.analysis.automation_potential} • Economia
          estimada: {process.analysis.estimated_savings_percent}%
        </p>
      </CardContent>
    </Card>
  );
}

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Idea, IdeaPhase } from "@/types/idea";
import { CalendarClock, Pencil, ArrowRightLeft, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

const phaseMeta: Record<IdeaPhase, { label: string; colorClass: string }> = {
  conception: {
    label: "Concepção",
    colorClass: "bg-[hsl(var(--primary)/0.08)] text-[hsl(var(--primary))] border-[hsl(var(--primary)/0.4)]",
  },
  validation: {
    label: "Validação",
    colorClass: "bg-[hsl(var(--accent)/0.12)] text-[hsl(var(--accent-foreground))] border-[hsl(var(--accent)/0.5)]",
  },
  structuring: {
    label: "Estruturação",
    colorClass: "bg-[hsl(var(--secondary)/0.18)] text-[hsl(var(--secondary-foreground))] border-[hsl(var(--secondary)/0.5)]",
  },
  implementation: {
    label: "Implantação",
    colorClass: "bg-[hsl(var(--primary)/0.18)] text-[hsl(var(--primary))] border-[hsl(var(--primary)/0.6)]",
  },
};

interface IdeaCardProps {
  idea: Idea;
  onEdit: () => void;
  onTransitionPhase: () => void;
  onDelete: () => void;
}

export function IdeaCard({ idea, onEdit, onTransitionPhase, onDelete }: IdeaCardProps) {
  const phaseInfo = phaseMeta[idea.current_phase];

  const shortDescription = idea.description
    ? idea.description.length > 140
      ? `${idea.description.slice(0, 137)}...`
      : idea.description
    : "Sem descrição detalhada ainda.";

  return (
    <Card className="df-stat-card flex h-full flex-col justify-between">
      <CardHeader className="space-y-2 pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-base font-semibold leading-snug">{idea.title}</CardTitle>
          <Badge className={cn("shrink-0 border px-2 py-0.5 text-xs", phaseInfo.colorClass)}>{phaseInfo.label}</Badge>
        </div>
        <p className="text-xs text-muted-foreground line-clamp-3">{shortDescription}</p>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1">
            <CalendarClock className="h-3 w-3" /> Criada: {idea.created_at}
          </span>
          <span className="inline-flex items-center gap-1">
            <CalendarClock className="h-3 w-3 opacity-60" /> Atualizada: {idea.updated_at}
          </span>
        </div>
        {idea.tags.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {idea.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between gap-2 pt-0">
        <div className="flex gap-2">
          <Button size="sm" variant="outline" onClick={onEdit}>
            <Pencil className="mr-1 h-3 w-3" /> Editar
          </Button>
          <Button size="sm" variant="outline" onClick={onTransitionPhase}>
            <ArrowRightLeft className="mr-1 h-3 w-3" /> Transicionar Fase
          </Button>
        </div>
        <Button size="sm" variant="destructive" onClick={onDelete}>
          <Trash2 className="mr-1 h-3 w-3" /> Deletar
        </Button>
      </CardFooter>
    </Card>
  );
}

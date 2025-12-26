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
    <Card className="flex h-full flex-col justify-between border-border/60 bg-background/80 px-3 py-2 shadow-sm hover-scale">
      <CardHeader className="p-0">
        <div className="flex items-center gap-2">
          <div className="h-1 w-8 rounded-full bg-[hsl(var(--primary)/0.7)]" />
          <CardTitle className="line-clamp-2 text-sm font-semibold leading-snug text-foreground">
            {idea.title}
          </CardTitle>
        </div>
      </CardHeader>
    </Card>
  );
}

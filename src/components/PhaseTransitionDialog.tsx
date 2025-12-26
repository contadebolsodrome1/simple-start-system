import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Idea, IdeaPhase } from "@/types/idea";
import { cn } from "@/lib/utils";

interface PhaseTransitionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  idea: Idea | null;
  onConfirm: (nextPhase: IdeaPhase) => void;
}

const phaseOrder: IdeaPhase[] = ["conception", "validation", "structuring", "implementation"];

const phaseLabels: Record<IdeaPhase, string> = {
  conception: "Concepção",
  validation: "Validação",
  structuring: "Estruturação",
  implementation: "Implantação",
};

export function PhaseTransitionDialog({ open, onOpenChange, idea, onConfirm }: PhaseTransitionDialogProps) {
  if (!idea) return null;

  const currentIndex = phaseOrder.indexOf(idea.current_phase);
  const nextPhase = currentIndex < phaseOrder.length - 1 ? phaseOrder[currentIndex + 1] : null;

  const handleConfirm = () => {
    if (!nextPhase) return;
    onConfirm(nextPhase);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader className="space-y-2">
          <DialogTitle>Transicionar fase da ideia</DialogTitle>
          <DialogDescription>
            Concepção → Validação → Estruturação → Implantação. Avance apenas para a próxima etapa da cadeia.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <div className="text-sm font-medium text-foreground">{idea.title}</div>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            {phaseOrder.map((phase, index) => {
              const isCurrent = idea.current_phase === phase;
              const isPast = index < currentIndex;
              const isFuture = index > currentIndex;

              return (
                <div key={phase} className="flex items-center gap-2">
                  <div
                    className={cn(
                      "rounded-full px-2 py-1 border text-[11px]",
                      isCurrent && "bg-[hsl(var(--primary)/0.12)] text-[hsl(var(--primary))] border-[hsl(var(--primary)/0.5)]",
                      isPast && "bg-[hsl(var(--accent)/0.15)] text-[hsl(var(--accent-foreground))] border-[hsl(var(--accent)/0.5)]",
                      isFuture && "bg-muted text-muted-foreground border-transparent",
                    )}
                  >
                    {phaseLabels[phase]}
                  </div>
                  {index < phaseOrder.length - 1 && <span className="text-muted-foreground">→</span>}
                </div>
              );
            })}
          </div>

          <div className="text-sm text-muted-foreground">
            {nextPhase ? (
              <>
                Próximo passo permitido: <span className="font-medium text-foreground">{phaseLabels[nextPhase]}</span>.
              </>
            ) : (
              <>Esta ideia já está na fase final <span className="font-medium text-foreground">Implantação</span>.</>
            )}
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button type="button" onClick={handleConfirm} disabled={!nextPhase}>
            Confirmar transição
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

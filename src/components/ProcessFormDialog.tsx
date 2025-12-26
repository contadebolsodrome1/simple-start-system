import { useEffect, useState, FormEvent } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Client } from "@/types/client";
import type { Process, ProcessCategory, ProcessComplexity, ProcessStep } from "@/types/process";

interface ProcessFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  clients: Client[];
  initialProcess?: Process | null;
  onSave: (process: Process) => void;
}

const categoryOptions: { value: ProcessCategory; label: string }[] = [
  { value: "sales", label: "Sales" },
  { value: "support", label: "Support" },
  { value: "operations", label: "Operations" },
  { value: "custom", label: "Custom" },
];

export function ProcessFormDialog({ open, onOpenChange, clients, initialProcess, onSave }: ProcessFormDialogProps) {
  const [clientId, setClientId] = useState("");
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<ProcessCategory>("sales");
  const [steps, setSteps] = useState<ProcessStep[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setClientId(initialProcess?.client_id ?? (clients[0]?.id ?? ""));
      setName(initialProcess?.name ?? "");
      setDescription(initialProcess?.description ?? "");
      setCategory(initialProcess?.category ?? "sales");
      setSteps(initialProcess?.steps ?? []);
      setError(null);
    }
  }, [open, initialProcess, clients]);

  const addStep = () => {
    const nextOrder = steps.length + 1;
    const newStep: ProcessStep = {
      id: crypto.randomUUID(),
      order: nextOrder,
      title: "",
      description: "",
      actor: "",
      duration_minutes: undefined,
      input_data: "",
      output_data: "",
    };
    setSteps((prev) => [...prev, newStep]);
  };

  const updateStep = (id: string, field: keyof ProcessStep, value: string) => {
    setSteps((prev) =>
      prev.map((step) =>
        step.id === id
          ? {
              ...step,
              [field]: field === "duration_minutes" ? (value ? Number(value) || undefined : undefined) : value,
            }
          : step,
      ),
    );
  };

  const removeStep = (id: string) => {
    setSteps((prev) => {
      const remaining = prev.filter((s) => s.id !== id);
      return remaining.map((s, index) => ({ ...s, order: index + 1 }));
    });
  };

  const computeComplexity = (totalSteps: number): ProcessComplexity => {
    if (totalSteps > 15) return "HIGH";
    if (totalSteps > 7) return "MEDIUM";
    return "LOW";
  };

  const computeAutomationPotential = (percent: number): ProcessComplexity => {
    if (percent > 66) return "HIGH";
    if (percent > 33) return "MEDIUM";
    return "LOW";
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Nome é obrigatório.");
      return;
    }

    if (!clientId) {
      setError("Selecione um cliente vinculado.");
      return;
    }

    const totalSteps = steps.length;
    const automatizableSteps = Math.round(totalSteps * 0.6);
    const estimatedSavings = totalSteps
      ? Math.round((automatizableSteps / totalSteps) * 100)
      : 0;

    const complexity = computeComplexity(totalSteps);
    const automationPotential = computeAutomationPotential(estimatedSavings);

    const client = clients.find((c) => c.id === clientId);
    if (!client) {
      setError("Cliente selecionado não encontrado.");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    const normalizedSteps = steps.map((s, index) => ({
      ...s,
      order: index + 1,
      title: s.title.trim(),
      description: s.description?.trim() || undefined,
      actor: s.actor?.trim() || undefined,
      input_data: s.input_data?.trim() || undefined,
      output_data: s.output_data?.trim() || undefined,
    }));

    const process: Process = {
      id: initialProcess?.id ?? crypto.randomUUID(),
      client_id: client.id,
      client_name: client.name,
      name: name.trim(),
      description: description.trim() || undefined,
      category,
      steps: normalizedSteps,
      analysis: {
        total_steps: totalSteps,
        complexity,
        automation_potential: automationPotential,
        estimated_savings_percent: estimatedSavings,
      },
      created_at: initialProcess?.created_at ?? today,
    };

    onSave(process);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="space-y-2">
            <DialogTitle>{initialProcess ? "Editar Processo" : "Mapear Novo Processo"}</DialogTitle>
            <DialogDescription>
              Estruture o fluxo atual para avaliar complexidade, automação e oportunidades de ganho.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="process-client">
                Cliente vinculado
              </label>
              <Select value={clientId} onValueChange={setClientId}>
                <SelectTrigger id="process-client">
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="process-name">
                Nome do processo
              </label>
              <Input
                id="process-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={140}
                placeholder="Ex: Funil de qualificação de leads inbound"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="process-category">
                Categoria
              </label>
              <Select value={category} onValueChange={(v) => setCategory(v as ProcessCategory)}>
                <SelectTrigger id="process-category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5 md:col-span-2">
              <label className="text-sm font-medium text-foreground" htmlFor="process-description">
                Descrição
              </label>
              <Textarea
                id="process-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                maxLength={1000}
                placeholder="Contexto geral, objetivo e fronteiras deste processo."
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Passos do processo</span>
              <Button type="button" variant="outline" size="sm" onClick={addStep}>
                + Adicionar passo
              </Button>
            </div>
            {steps.length === 0 ? (
              <p className="text-xs text-muted-foreground">Nenhum passo definido ainda.</p>
            ) : (
              <div className="max-h-72 space-y-3 overflow-y-auto pr-1">
                {steps.map((step) => (
                  <div
                    key={step.id}
                    className="space-y-2 rounded-md border border-border/60 bg-card/60 p-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Passo {step.order}</span>
                      <Button type="button" variant="outline" size="icon" onClick={() => removeStep(step.id)}>
                        ×
                      </Button>
                    </div>
                    <div className="grid gap-2 md:grid-cols-2">
                      <Input
                        placeholder="Título do passo"
                        value={step.title}
                        onChange={(e) => updateStep(step.id, "title", e.target.value)}
                      />
                      <Input
                        placeholder="Ator / Responsável"
                        value={step.actor || ""}
                        onChange={(e) => updateStep(step.id, "actor", e.target.value)}
                      />
                      <Input
                        placeholder="Duração estimada (minutos)"
                        value={step.duration_minutes?.toString() || ""}
                        onChange={(e) => updateStep(step.id, "duration_minutes", e.target.value)}
                      />
                      <Input
                        placeholder="Dados de entrada"
                        value={step.input_data || ""}
                        onChange={(e) => updateStep(step.id, "input_data", e.target.value)}
                      />
                      <Input
                        placeholder="Dados de saída"
                        value={step.output_data || ""}
                        onChange={(e) => updateStep(step.id, "output_data", e.target.value)}
                      />
                    </div>
                    <Textarea
                      placeholder="Descrição do passo"
                      value={step.description || ""}
                      onChange={(e) => updateStep(step.id, "description", e.target.value)}
                      rows={2}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-sm font-medium text-destructive">{error}</p>}

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit">Salvar</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

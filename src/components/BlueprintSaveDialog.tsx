import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormEvent, useEffect, useState } from "react";

interface BlueprintSaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (payload: { name: string; description?: string }) => void;
}

export function BlueprintSaveDialog({ open, onOpenChange, onSave }: BlueprintSaveDialogProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName("");
      setDescription("");
      setError(null);
    }
  }, [open]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Nome é obrigatório.");
      return;
    }
    onSave({ name: name.trim(), description: description.trim() || undefined });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="space-y-2">
            <DialogTitle>Salvar Blueprint</DialogTitle>
            <DialogDescription>
              Dê um nome a este blueprint de sistema para consultá-lo e evoluí-lo depois.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="bp-name">
              Nome
            </label>
            <Input
              id="bp-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={140}
              placeholder="Ex: DromeFlow – CRM para Funil Inbound"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="bp-description">
              Descrição
            </label>
            <Textarea
              id="bp-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              maxLength={800}
              placeholder="Contexto deste blueprint, escopo e observações principais."
            />
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

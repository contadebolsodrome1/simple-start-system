import { useEffect, useState, KeyboardEvent, FormEvent } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Idea, IdeaCategory, IdeaPhase } from "@/types/idea";

interface IdeaFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialIdea?: Idea | null;
  onSave: (payload: {
    id?: string;
    title: string;
    description?: string;
    current_phase: IdeaPhase;
    category: IdeaCategory;
    tags: string[];
  }) => void;
}

const categoryLabels: Record<IdeaCategory, string> = {
  sales: "Sales",
  operations: "Operations",
  support: "Support",
  custom: "Custom",
};

export function IdeaFormDialog({ open, onOpenChange, initialIdea, onSave }: IdeaFormDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<IdeaCategory>("sales");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setTitle(initialIdea?.title ?? "");
      setDescription(initialIdea?.description ?? "");
      setCategory(initialIdea?.category ?? "sales");
      setTags(initialIdea?.tags ?? []);
      setTagInput("");
      setError(null);
    }
  }, [open, initialIdea]);

  const commitTag = () => {
    const value = tagInput.trim();
    if (!value) return;
    if (!tags.includes(value)) {
      setTags((prev) => [...prev, value]);
    }
    setTagInput("");
  };

  const handleTagKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      commitTag();
    } else if (e.key === "Backspace" && !tagInput && tags.length) {
      setTags((prev) => prev.slice(0, -1));
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError("Título é obrigatório.");
      return;
    }

    const payload = {
      id: initialIdea?.id,
      title: title.trim(),
      description: description.trim() || undefined,
      current_phase: initialIdea?.current_phase ?? "conception",
      category,
      tags,
    } as const;

    onSave(payload);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="space-y-2">
            <DialogTitle>{initialIdea ? "Editar Ideia" : "Criar Nova Ideia"}</DialogTitle>
            <DialogDescription>
              Estruture rapidamente uma nova iniciativa para o seu pipeline DromeFlow.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="idea-title">
              Título
            </label>
            <Input
              id="idea-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Automação de follow-up para leads frios"
              maxLength={100}
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="idea-description">
              Descrição
            </label>
            <Textarea
              id="idea-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contexto, objetivo e recorte inicial desta ideia."
              maxLength={1000}
              rows={4}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="idea-category">
                Categoria
              </label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as IdeaCategory)}
              >
                <SelectTrigger id="idea-category">
                  <SelectValue placeholder="Selecione uma categoria" />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(categoryLabels) as IdeaCategory[]).map((key) => (
                    <SelectItem key={key} value={key}>
                      {categoryLabels[key]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="idea-tags">
                Tags
              </label>
              <Input
                id="idea-tags"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Digite e pressione Enter para adicionar"
              />
              {tags.length > 0 && (
                <div className="mt-1 flex flex-wrap gap-1.5 text-xs">
                  {tags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setTags((prev) => prev.filter((t) => t !== tag))}
                      className="inline-flex items-center gap-1 rounded-full bg-muted px-2 py-0.5 text-muted-foreground hover:bg-muted/80"
                    >
                      <span>#{tag}</span>
                      <span className="text-[10px]">×</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
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

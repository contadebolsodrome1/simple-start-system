import type { Secret, Tool, Tag, KeyType, SecretStatus } from "@/types/Secret";
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { useMemo, useState } from "react";

interface ClientOption {
  id: string;
  name: string;
}

interface KeyFormProps {
  initial?: Secret | null;
  tools: Tool[];
  tags: Tag[];
  clients: ClientOption[];
  onSubmit: (data: Omit<Secret, "id" | "created_at" | "updated_at">) => void;
  onClose: () => void;
}

export const KeyForm = ({ initial, tools, tags, clients, onSubmit, onClose }: KeyFormProps) => {
  const [name, setName] = useState(initial?.name ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [toolId, setToolId] = useState(initial?.tool ?? tools[0]?.id ?? "stripe");
  const [keyType, setKeyType] = useState<KeyType>(initial?.key_type ?? "api_key");
  const [value, setValue] = useState(initial?.value ?? "");
  const [selectedTags, setSelectedTags] = useState<string[]>(initial?.tags ?? []);
  const [clientId, setClientId] = useState(initial?.client_id ?? "generico");
  const [status, setStatus] = useState<SecretStatus>(initial?.status ?? "active");
  const [neverExpires, setNeverExpires] = useState(!initial?.expires_at);
  const [expiresAt, setExpiresAt] = useState(initial?.expires_at ? initial.expires_at.toISOString().slice(0, 16) : "");
  const [notes, setNotes] = useState(initial?.notes ?? "");

  const tool = tools.find((t) => t.id === toolId);
  const typeOptions = useMemo(() => tool?.key_types ?? ["api_key", "token", "connection_string"], [tool]);

  const toggleTag = (id: string, checked: boolean) => {
    const next = new Set(selectedTags);
    if (checked) next.add(id);
    else next.delete(id);
    setSelectedTags(Array.from(next));
  };

  const handleSubmit = () => {
    if (!name.trim() || !value.trim()) return;
    onSubmit({
      ...(initial ?? {}),
      name: name.trim(),
      description: description.trim() || undefined,
      tool: toolId,
      key_type: keyType,
      value: value.trim(),
      tags: selectedTags,
      client_id: clientId,
      status,
      expires_at: neverExpires || !expiresAt ? null : new Date(expiresAt),
      notes: notes.trim() || undefined,
      created_by: initial?.created_by ?? "user-001",
      visibility: initial?.visibility ?? "masked",
    } as Omit<Secret, "id" | "created_at" | "updated_at">);
  };

  return (
    <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
      <DialogHeader>
        <DialogTitle>{initial ? "Editar chave" : "Adicionar nova chave"}</DialogTitle>
        <DialogDescription>
          Centralize chaves de API, tokens e secrets sensíveis. Use apenas valores de desenvolvimento nesta versão.
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-5 py-2">
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label>Nome / descrição rápida</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Stripe Live SK, n8n token staging"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Descrição detalhada (opcional)</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Contextualize uso, integrações associadas ou riscos desta chave."
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Ferramenta</Label>
            <Select value={toolId} onValueChange={setToolId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tools.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.icon} {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Tipo de chave</Label>
            <Select value={keyType} onValueChange={(v: KeyType) => setKeyType(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Valor da chave</Label>
          <Textarea
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Cole aqui a chave, token ou secret (apenas ambientes de desenvolvimento/staging)."
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Tags</Label>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <label key={tag.id} className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--muted))] px-2 py-0.5 text-[11px]">
                  <Checkbox
                    checked={selectedTags.includes(tag.id)}
                    onCheckedChange={(checked) => toggleTag(tag.id, Boolean(checked))}
                    className="h-3.5 w-3.5"
                  />
                  <span>{tag.name}</span>
                </label>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Cliente</Label>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="generico">Genérico</SelectItem>
                {clients.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>Status</Label>
            <Select value={status} onValueChange={(v: SecretStatus) => setStatus(v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Ativo</SelectItem>
                <SelectItem value="inactive">Inativo</SelectItem>
                <SelectItem value="revoked">Revogado</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label>Data de expiração (opcional)</Label>
            <div className="space-y-1">
              <Input
                type="datetime-local"
                value={neverExpires ? "" : expiresAt}
                onChange={(e) => setExpiresAt(e.target.value)}
                disabled={neverExpires}
              />
              <label className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
                <Checkbox
                  checked={neverExpires}
                  onCheckedChange={(checked) => setNeverExpires(Boolean(checked))}
                  className="h-3.5 w-3.5"
                />
                Nunca expira
              </label>
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label>Notas (opcional)</Label>
          <Textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Observações adicionais, integrações que dependem desta chave, etc."
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-2 pt-3">
        <Button variant="outline" size="sm" onClick={onClose}>
          Cancelar
        </Button>
        <Button size="sm" onClick={handleSubmit} disabled={!name.trim() || !value.trim()}>
          {initial ? "Atualizar chave" : "Salvar chave"}
        </Button>
      </div>
    </DialogContent>
  );
};

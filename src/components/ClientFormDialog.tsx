import { useEffect, useState, KeyboardEvent, FormEvent } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Client, ClientContact, ClientStatus } from "@/types/client";

interface ClientFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialClient?: Client | null;
  onSave: (client: Client) => void;
}

const statusOptions: { value: ClientStatus; label: string }[] = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "prospect", label: "Prospect" },
];

const industries = ["Services", "Technology", "Industry", "Retail", "Other"];

export function ClientFormDialog({ open, onOpenChange, initialClient, onSave }: ClientFormDialogProps) {
  const [name, setName] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [industry, setIndustry] = useState<string>("");
  const [website, setWebsite] = useState("");
  const [status, setStatus] = useState<ClientStatus>("prospect");
  const [contacts, setContacts] = useState<ClientContact[]>([]);
  const [notes, setNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      setName(initialClient?.name ?? "");
      setCnpj(initialClient?.cnpj ?? "");
      setIndustry(initialClient?.industry ?? "");
      setWebsite(initialClient?.website ?? "");
      setStatus(initialClient?.status ?? "prospect");
      setContacts(initialClient?.contacts ?? []);
      setNotes(initialClient?.notes ?? "");
      setError(null);
    }
  }, [open, initialClient]);

  const addEmptyContact = () => {
    const newContact: ClientContact = {
      id: crypto.randomUUID(),
      name: "",
      email: "",
      phone: "",
      role: "Principal",
    };
    setContacts((prev) => [...prev, newContact]);
  };

  const updateContactField = (id: string, field: keyof ClientContact, value: string) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [field]: value } : c)),
    );
  };

  const removeContact = (id: string) => {
    setContacts((prev) => prev.filter((c) => c.id !== id));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!name.trim()) {
      setError("Nome é obrigatório.");
      return;
    }

    const today = new Date().toISOString().slice(0, 10);

    const base: Client = {
      id: initialClient?.id ?? crypto.randomUUID(),
      name: name.trim(),
      cnpj: cnpj.trim() || undefined,
      industry: industry.trim() || undefined,
      website: website.trim() || undefined,
      status,
      contacts: contacts.map((c) => ({
        ...c,
        name: c.name.trim(),
        email: c.email.trim(),
        phone: c.phone?.trim() || undefined,
      })),
      notes: notes.trim() || undefined,
      created_at: initialClient?.created_at ?? today,
    };

    onSave(base);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader className="space-y-2">
            <DialogTitle>{initialClient ? "Editar Cliente" : "Novo Cliente"}</DialogTitle>
            <DialogDescription>
              Cadastre clientes para conectar ideias, processos e métricas dentro da DromeFlow.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="client-name">
                Nome
              </label>
              <Input
                id="client-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                maxLength={120}
                placeholder="Empresa X"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="client-cnpj">
                CNPJ
              </label>
              <Input
                id="client-cnpj"
                value={cnpj}
                onChange={(e) => setCnpj(e.target.value)}
                placeholder="xx.xxx.xxx/xxxx-xx"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="client-industry">
                Indústria
              </label>
              <Select value={industry} onValueChange={setIndustry}>
                <SelectTrigger id="client-industry">
                  <SelectValue placeholder="Selecione a indústria" />
                </SelectTrigger>
                <SelectContent>
                  {industries.map((ind) => (
                    <SelectItem key={ind} value={ind}>
                      {ind}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="client-website">
                Website
              </label>
              <Input
                id="client-website"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://empresa.com"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-foreground" htmlFor="client-status">
                Status
              </label>
              <Select value={status} onValueChange={(v) => setStatus(v as ClientStatus)}>
                <SelectTrigger id="client-status">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((o) => (
                    <SelectItem key={o.value} value={o.value}>
                      {o.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Contatos</span>
              <Button type="button" variant="outline" size="sm" onClick={addEmptyContact}>
                + Adicionar contato
              </Button>
            </div>
            {contacts.length === 0 ? (
              <p className="text-xs text-muted-foreground">
                Nenhum contato adicionado ainda.
              </p>
            ) : (
              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {contacts.map((contact) => (
                  <div
                    key={contact.id}
                    className="grid gap-2 rounded-md border border-border/60 bg-card/60 p-3 md:grid-cols-[1.5fr,1.5fr,1fr,auto]"
                  >
                    <Input
                      placeholder="Nome"
                      value={contact.name}
                      onChange={(e) => updateContactField(contact.id, "name", e.target.value)}
                    />
                    <Input
                      placeholder="Email"
                      type="email"
                      value={contact.email}
                      onChange={(e) => updateContactField(contact.id, "email", e.target.value)}
                    />
                    <Input
                      placeholder="Telefone"
                      value={contact.phone || ""}
                      onChange={(e) => updateContactField(contact.id, "phone", e.target.value)}
                    />
                    <div className="flex gap-2">
                      <Select
                        value={contact.role}
                        onValueChange={(v) => updateContactField(contact.id, "role", v as ClientContact["role"])}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Principal">Principal</SelectItem>
                          <SelectItem value="Secundário">Secundário</SelectItem>
                        </SelectContent>
                      </Select>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="shrink-0"
                        onClick={() => removeContact(contact.id)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium text-foreground" htmlFor="client-notes">
              Notas
            </label>
            <Textarea
              id="client-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Contexto comercial, histórico e próximos passos."
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

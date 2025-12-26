import { useEffect, useMemo, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { loadAutomations, saveAutomations } from "@/lib/automationsStorage";
import type { Automation, AutomationAction, AutomationActionType, AutomationTriggerType } from "@/types/automation";
import { cn } from "@/lib/utils";

const triggerLabels: Record<AutomationTriggerType, string> = {
  webhook: "Webhook",
  schedule: "Schedule",
  event: "Event",
  manual: "Manual",
};

const actionLabels: Record<AutomationActionType, string> = {
  send_whatsapp: "Send WhatsApp",
  create_client: "Create Client",
  update_process: "Update Process",
  notify_team: "Notify Team",
};

const createEmptyAutomation = (): Automation => ({
  id: crypto.randomUUID(),
  name: "",
  description: "",
  triggerType: "webhook",
  triggerConfig: "",
  actions: [],
  status: "active",
  createdAt: new Date().toISOString(),
});

const AutomationsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [automations, setAutomations] = useState<Automation[]>(() => loadAutomations());
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [draft, setDraft] = useState<Automation>(() => createEmptyAutomation());

  useEffect(() => {
    document.title = "DromeFlow – Automações";
  }, []);

  const handleOpenNew = () => {
    setDraft(createEmptyAutomation());
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!draft.name.trim()) return;
    setAutomations((prev) => {
      const exists = prev.some((a) => a.id === draft.id);
      const updated = exists ? prev.map((a) => (a.id === draft.id ? draft : a)) : [draft, ...prev];
      saveAutomations(updated);
      return updated;
    });
    setIsDialogOpen(false);
  };

  const addAction = () => {
    const newAction: AutomationAction = {
      id: crypto.randomUUID(),
      type: "send_whatsapp",
      name: "",
    };
    setDraft((prev) => ({ ...prev, actions: [...prev.actions, newAction] }));
  };

  const updateAction = (id: string, patch: Partial<AutomationAction>) => {
    setDraft((prev) => ({
      ...prev,
      actions: prev.actions.map((a) => (a.id === id ? { ...a, ...patch } : a)),
    }));
  };

  const removeAction = (id: string) => {
    setDraft((prev) => ({ ...prev, actions: prev.actions.filter((a) => a.id !== id) }));
  };

  const previewFlow = useMemo(() => {
    const steps = [triggerLabels[draft.triggerType], ...draft.actions.map((a, idx) => `${idx + 1}. ${actionLabels[a.type]}`)];
    return steps.join(" → ");
  }, [draft.triggerType, draft.actions]);

  const openDetail = (id: string) => {
    navigate(`/automations/${id}`);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-[hsl(var(--df-muted-deep))] to-[hsl(var(--df-hero-accent))]">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader email={user?.email ?? ""} />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pb-10 pt-6">

            <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {automations.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma automação criada ainda. Clique em "+ Nova Automação" para configurar o primeiro fluxo.
                </p>
              ) : (
                automations.map((automation) => (
                  <Card
                    key={automation.id}
                    className="cursor-pointer border-border/70 bg-card/80 transition hover:border-accent/70 hover:bg-card/90"
                    onClick={() => openDetail(automation.id)}
                  >
                    <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                      <div className="space-y-1">
                        <CardTitle className="text-sm font-semibold leading-snug">
                          {automation.name}
                        </CardTitle>
                        <p className="text-xs text-muted-foreground">
                          {triggerLabels[automation.triggerType]} trigger
                        </p>
                      </div>
                      <Badge
                        variant={automation.status === "active" ? "default" : "outline"}
                        className={cn(
                          "text-[11px]",
                          automation.status === "inactive" && "border-border/60 text-muted-foreground",
                        )}
                      >
                        {automation.status === "active" ? "Ativo" : "Inativo"}
                      </Badge>
                    </CardHeader>
                    <CardContent className="space-y-2 pb-4 text-xs text-muted-foreground">
                      {automation.description && <p className="line-clamp-2">{automation.description}</p>}
                      <p>
                        Ações: <span className="font-medium text-foreground">{automation.actions.length}</span>
                      </p>
                      <p>
                        Criada em: {new Date(automation.createdAt).toLocaleString()}
                      </p>
                    </CardContent>
                  </Card>
                ))
              )}
            </section>
          </main>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Criar Nova Automação</DialogTitle>
            <DialogDescription>
              Defina o gatilho, as ações e visualize rapidamente o fluxo que será executado.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 py-2">
            <section className="space-y-3">
              <h2 className="text-sm font-semibold tracking-tight">Dados básicos</h2>
              <div className="grid gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="automation-name">Nome</Label>
                  <Input
                    id="automation-name"
                    value={draft.name}
                    onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                    placeholder="Ex: Notificar time quando novo cliente VIP é criado"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="automation-description">Descrição</Label>
                  <Textarea
                    id="automation-description"
                    value={draft.description}
                    onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                    placeholder="Contextualize rapidamente o objetivo e o resultado esperado desta automação."
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <Label>Tipo de Trigger</Label>
                    <Select
                      value={draft.triggerType}
                      onValueChange={(value: AutomationTriggerType) =>
                        setDraft({ ...draft, triggerType: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo de trigger" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="webhook">Webhook</SelectItem>
                        <SelectItem value="schedule">Schedule (agenda)</SelectItem>
                        <SelectItem value="event">Event (evento)</SelectItem>
                        <SelectItem value="manual">Manual</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1.5">
                    <Label>Configuração do Trigger</Label>
                    <Input
                      value={draft.triggerConfig}
                      onChange={(e) => setDraft({ ...draft, triggerConfig: e.target.value })}
                      placeholder={
                        draft.triggerType === "schedule"
                          ? "Ex: diariamente às 08:00"
                          : draft.triggerType === "event"
                            ? "Ex: order_created, client_added"
                            : draft.triggerType === "webhook"
                              ? "URL ou identificador do webhook"
                              : "Observações para execução manual"
                      }
                    />
                  </div>
                </div>
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-tight">Ações</h2>
                <Button size="sm" variant="outline" onClick={addAction}>
                  + Adicionar ação
                </Button>
              </div>
              {draft.actions.length === 0 ? (
                <p className="text-xs text-muted-foreground">
                  Nenhuma ação configurada. Adicione uma ou mais ações para compor o fluxo.
                </p>
              ) : (
                <div className="space-y-3">
                  {draft.actions.map((action, index) => (
                    <Card key={action.id} className="border-border/70 bg-card/70">
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs font-semibold">
                          Ação {index + 1}
                        </CardTitle>
                        <Button size="icon" variant="ghost" className="h-6 w-6" onClick={() => removeAction(action.id)}>
                          ×
                        </Button>
                      </CardHeader>
                      <CardContent className="grid gap-3 text-xs">
                        <div className="grid gap-3 md:grid-cols-2">
                          <div className="space-y-1.5">
                            <Label>Tipo de ação</Label>
                            <Select
                              value={action.type}
                              onValueChange={(value: AutomationActionType) =>
                                updateAction(action.id, { type: value })
                              }
                            >
                              <SelectTrigger className="h-8 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="send_whatsapp">Send WhatsApp</SelectItem>
                                <SelectItem value="create_client">Create Client</SelectItem>
                                <SelectItem value="update_process">Update Process</SelectItem>
                                <SelectItem value="notify_team">Notify Team</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="space-y-1.5">
                            <Label>Rótulo interno</Label>
                            <Input
                              className="h-8"
                              value={action.name ?? ""}
                              onChange={(e) => updateAction(action.id, { name: e.target.value })}
                              placeholder="Ex: Avisar SDR no WhatsApp"
                            />
                          </div>
                        </div>

                        {action.type === "send_whatsapp" && (
                          <div className="grid gap-3 md:grid-cols-[2fr,1fr]">
                            <div className="space-y-1.5">
                              <Label>Modelo de mensagem</Label>
                              <Textarea
                                rows={3}
                                value={action.whatsappTemplate ?? ""}
                                onChange={(e) => updateAction(action.id, { whatsappTemplate: e.target.value })}
                                placeholder="Ex: Olá {client_name}, recebemos seu pedido {order_id}!"
                              />
                              <p className="text-[11px] text-muted-foreground">
                                Use variáveis como {"{client_name}"} e {"{order_id}"} para personalizar.
                              </p>
                            </div>
                            <div className="space-y-1.5">
                              <Label>Destinatário</Label>
                              <Input
                                value={action.whatsappRecipientId ?? ""}
                                onChange={(e) => updateAction(action.id, { whatsappRecipientId: e.target.value })}
                                placeholder="Selecione ou informe o contato alvo"
                              />
                            </div>
                          </div>
                        )}

                        {action.type === "create_client" && (
                          <div className="space-y-1.5">
                            <Label>Campos a preencher</Label>
                            <Textarea
                              rows={3}
                              value={action.createClientPayload ?? ""}
                              onChange={(e) => updateAction(action.id, { createClientPayload: e.target.value })}
                              placeholder="Descreva quais campos serão preenchidos (nome, e-mail, segmento, origem, etc.)."
                            />
                          </div>
                        )}

                        {action.type === "notify_team" && (
                          <div className="space-y-1.5">
                            <Label>Tipo de notificação</Label>
                            <Input
                              className="h-8"
                              value={action.notifyType ?? ""}
                              onChange={(e) => updateAction(action.id, { notifyType: e.target.value })}
                              placeholder="Ex: Slack #ops, e-mail gestão, etc."
                            />
                          </div>
                        )}

                        {action.type === "update_process" && (
                          <p className="text-[11px] text-muted-foreground">
                            Esta ação poderá atualizar status, responsável ou próximos passos de um processo mapeado.
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </section>

            <section className="space-y-2">
              <h2 className="text-sm font-semibold tracking-tight">Preview</h2>
              <Card className="border-dashed border-border/70 bg-card/60">
                <CardContent className="py-3 text-xs text-muted-foreground">
                  {previewFlow || "Defina trigger e ações para visualizar aqui o fluxo da automação."}
                </CardContent>
              </Card>
            </section>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => setIsDialogOpen(false)}>
                Cancelar
              </Button>
              <Button size="sm" onClick={handleSave} disabled={!draft.name.trim()}>
                Salvar automação
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default AutomationsPage;

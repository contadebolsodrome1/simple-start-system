import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import type { Automation } from "@/types/automation";
import { loadAutomations, saveAutomations } from "@/lib/automationsStorage";
import { cn } from "@/lib/utils";

const AutomationDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [automation, setAutomation] = useState<Automation | undefined>(() =>
    loadAutomations().find((a) => a.id === id),
  );

  useEffect(() => {
    document.title = automation ? `DromeFlow – ${automation.name}` : "DromeFlow – Automação";
  }, [automation]);

  const updateAutomationStatus = (active: boolean) => {
    if (!automation) return;
    const updated: Automation = { ...automation, status: active ? "active" : "inactive" };
    setAutomation(updated);
    const all = loadAutomations();
    const next = all.map((a) => (a.id === updated.id ? updated : a));
    saveAutomations(next);
  };

  const logs = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, index) => ({
        id: `${index}`,
        status: index === 0 ? "success" : index === 3 ? "failed" : "success",
        timestamp: new Date(Date.now() - index * 60 * 60 * 1000).toISOString(),
      })),
    [],
  );

  if (!automation) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-[hsl(var(--df-muted-deep))] to-[hsl(var(--df-hero-accent))]">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <DashboardHeader email={user?.email ?? ""} />
            <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 pb-10 pt-6">
              <p className="text-sm text-muted-foreground">Automação não encontrada.</p>
              <Button variant="outline" onClick={() => navigate("/automations")}>
                Voltar para lista de automações
              </Button>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-[hsl(var(--df-muted-deep))] to-[hsl(var(--df-hero-accent))]">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader email={user?.email ?? ""} />
          <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6 px-4 pb-10 pt-6">
            <section className="df-hero-surface">
              <div className="relative flex flex-col gap-3 px-6 py-6 md:px-8 md:py-7">
                <p className="df-badge-soft w-fit">Automação</p>
                <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {automation.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Criada em {new Date(automation.createdAt).toLocaleString()}
                </p>
                <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                  <span>Status:</span>
                  <Badge
                     variant={automation.status === "active" ? "default" : "outline"}
                     className={cn(
                       "text-[11px]",
                       automation.status === "active" &&
                         "bg-[hsl(var(--secondary)/0.2)] text-[hsl(var(--secondary-foreground))] border-[hsl(var(--secondary))]",
                       automation.status === "inactive" && "border-border/60 text-muted-foreground",
                     )}
                   >
                     {automation.status === "active" ? "Ativo" : "Inativo"}
                   </Badge>
                  <Separator orientation="vertical" className="mx-2 h-4" />
                  <div className="flex items-center gap-1.5">
                    <Switch
                      id="toggle-status"
                      checked={automation.status === "active"}
                      onCheckedChange={updateAutomationStatus}
                    />
                    <label htmlFor="toggle-status" className="text-xs text-muted-foreground">
                      {automation.status === "active" ? "Desativar" : "Ativar"}
                    </label>
                  </div>
                </div>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-[2fr,1fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Configuração</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm text-muted-foreground">
                  <div>
                    <p className="font-medium text-foreground">Trigger</p>
                    <p className="text-xs text-muted-foreground">{automation.triggerType}</p>
                    {automation.triggerConfig && (
                      <p className="mt-1 text-xs">{automation.triggerConfig}</p>
                    )}
                  </div>
                  <Separator />
                  <div className="space-y-2">
                    <p className="font-medium text-foreground">Ações ({automation.actions.length})</p>
                    {automation.actions.length === 0 ? (
                      <p className="text-xs text-muted-foreground">Nenhuma ação configurada.</p>
                    ) : (
                      <ol className="space-y-2 text-xs">
                        {automation.actions.map((action, index) => (
                          <li
                            key={action.id}
                            className="rounded-md border border-border/60 bg-card/70 p-3"
                          >
                            <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                              <span>Ação {index + 1}</span>
                              <span>{action.type}</span>
                            </div>
                            {action.name && (
                              <p className="mt-1 text-xs font-medium text-foreground">{action.name}</p>
                            )}
                            {action.whatsappTemplate && (
                              <p className="mt-1 text-[11px] text-muted-foreground">
                                WhatsApp: {action.whatsappTemplate}
                              </p>
                            )}
                            {action.whatsappRecipientId && (
                              <p className="mt-1 text-[11px] text-muted-foreground">
                                Para: {action.whatsappRecipientId}
                              </p>
                            )}
                            {action.createClientPayload && (
                              <p className="mt-1 text-[11px] text-muted-foreground">
                                Create Client: {action.createClientPayload}
                              </p>
                            )}
                            {action.notifyType && (
                              <p className="mt-1 text-[11px] text-muted-foreground">
                                Notify: {action.notifyType}
                              </p>
                            )}
                          </li>
                        ))}
                      </ol>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Execuções simuladas</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-xs text-muted-foreground">
                  <p>
                    Logs gerados apenas para simulação de histórico. Integração real com n8n será adicionada futuramente.
                  </p>
                  <Separator />
                  <div className="space-y-1.5">
                    {logs.map((log) => (
                      <div
                        key={log.id}
                        className="flex items-center justify-between rounded-md border border-border/40 bg-card/60 px-2 py-1.5"
                      >
                        <span className="text-[11px]">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                        <span
                           className={cn(
                             "text-[11px] font-medium",
                             log.status === "success"
                               ? "text-[hsl(var(--secondary))]"
                               : "text-[hsl(var(--accent))]",
                           )}
                         >
                           {log.status === "success" ? "Success" : "Failed"}
                         </span>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => navigate(`/automations/${automation.id}`)}
                  >
                    Editar (abrir em construtor futuramente)
                  </Button>
                </CardContent>
              </Card>
            </section>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default AutomationDetailPage;

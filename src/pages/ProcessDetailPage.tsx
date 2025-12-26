import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useAuth } from "@/context/AuthContext";
import type { Process } from "@/types/process";
import { loadProcesses } from "@/lib/processesStorage";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProcessDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const process: Process | undefined = loadProcesses().find((p) => p.id === id);

  useEffect(() => {
    document.title = process ? `DromeFlow – ${process.name}` : "DromeFlow – Processo";
  }, [process]);

  if (!process) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-[hsl(var(--df-muted-deep))] to-[hsl(var(--df-hero-accent))]">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <DashboardHeader email={user?.email ?? ""} />
            <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 pb-10 pt-6">
              <p className="text-sm text-muted-foreground">Processo não encontrado.</p>
              <Button variant="outline" onClick={() => navigate("/processes")}>
                Voltar para lista de processos
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
                <p className="df-badge-soft w-fit">Processo</p>
                <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {process.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  {process.category.charAt(0).toUpperCase() + process.category.slice(1)} • {process.client_name}
                </p>
              </div>
            </section>

            <section className="grid gap-4 md:grid-cols-[2fr,1fr]">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Passos do processo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  {process.steps.length === 0 ? (
                    <p className="text-muted-foreground">Nenhum passo definido para este processo.</p>
                  ) : (
                    <ol className="space-y-3">
                      {process.steps.map((step) => (
                        <li key={step.id} className="space-y-1 rounded-md border border-border/60 bg-card/60 p-3">
                          <div className="flex items-center justify-between text-xs text-muted-foreground">
                            <span>Passo {step.order}</span>
                            {step.duration_minutes !== undefined && (
                              <span>{step.duration_minutes} min</span>
                            )}
                          </div>
                          <p className="text-sm font-medium text-foreground">{step.title}</p>
                          {step.description && <p className="text-xs text-muted-foreground">{step.description}</p>}
                          <div className="mt-2 grid gap-1 text-xs text-muted-foreground md:grid-cols-2">
                            {step.actor && <p>Ator: {step.actor}</p>}
                            {step.input_data && <p>Entrada: {step.input_data}</p>}
                            {step.output_data && <p>Saída: {step.output_data}</p>}
                          </div>
                        </li>
                      ))}
                    </ol>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Análise de automação</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>Total de passos: {process.analysis.total_steps}</p>
                  <p>Complexidade: {process.analysis.complexity}</p>
                  <p>Potencial de automação: {process.analysis.automation_potential}</p>
                  <p>Economia estimada: {process.analysis.estimated_savings_percent}%</p>
                  <Button
                    className="mt-2"
                    size="sm"
                    onClick={() => navigate("/system-architect")}
                  >
                    Estruturar Sistema
                  </Button>
                </CardContent>
              </Card>
            </section>

            <section>
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Fluxo visual</CardTitle>
                </CardHeader>
                <CardContent>
                  {process.steps.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      Adicione passos ao processo para visualizar o fluxo.
                    </p>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      {process.steps.map((step, index) => (
                        <div key={step.id} className="flex items-center gap-2">
                          <div className="rounded-md border border-border/60 bg-card/80 px-3 py-2">
                            <div className="text-[11px] font-semibold text-muted-foreground">{step.order}</div>
                            <div className="text-xs text-foreground">{step.title}</div>
                          </div>
                          {index < process.steps.length - 1 && <span className="text-muted-foreground">→</span>}
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ProcessDetailPage;

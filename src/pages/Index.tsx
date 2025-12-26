import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { Lightbulb } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { stats } from "./dashboardStats";

const Index = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "DromeFlow – Dashboard";
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-[hsl(var(--df-muted-deep))] to-[hsl(var(--df-hero-accent))]">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader email={user?.email ?? ""} onNewIdea={() => navigate("/ideas")} />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pb-10 pt-6">
            <section className="df-hero-surface animate-df-fade-up">
              <div className="df-hero-orbit animate-df-orbit" aria-hidden="true" />
              <div className="relative flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-7">
                <div className="space-y-2 md:space-y-3">
                  <p className="df-badge-soft w-fit">Bem-vindo ao cockpit de orquestração</p>
                  <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                    Olá, {user?.email?.split("@")[0] ?? "estrategista"}. Vamos acelerar seus fluxos com a DromeFlow.
                  </h1>
                  <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                    Acompanhe ideias, clientes e blueprints em um só lugar. Este é o painel base para suas próximas automações.
                  </p>
                </div>
                <div className="mt-3 flex flex-col gap-2 md:mt-0 md:items-end">
                  <Button
                    variant="default"
                    size="lg"
                    className="shadow-[0_10px_30px_-18px_hsl(var(--df-shadow-strong))]"
                    onClick={() => navigate("/ideas")}
                  >
                    <Lightbulb className="mr-2 h-4 w-4" />
                    Registrar nova ideia
                  </Button>
                  <p className="text-xs text-muted-foreground">Próximo passo: mapeie o primeiro fluxo crítico.</p>
                </div>
              </div>
            </section>

            <section aria-label="Indicadores principais" className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((stat) => (
                <Card key={stat.label} className="df-stat-card">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-[0.12em]">
                      {stat.label}
                    </CardTitle>
                    <stat.icon className="h-4 w-4 text-[hsl(var(--primary))]" />
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-semibold tracking-tight">{stat.value}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Dados simulados para a versão inicial.</p>
                  </CardContent>
                </Card>
              ))}
            </section>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Index;

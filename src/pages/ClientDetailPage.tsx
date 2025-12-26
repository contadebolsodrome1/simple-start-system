import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartConfig } from "@/components/ui/chart";
import { Line, LineChart, XAxis, YAxis, CartesianGrid } from "recharts";
import type { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

const chartConfig = {
  interactions: {
    label: "Interações",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

const fakeData = [
  { month: "Jan", interactions: 3 },
  { month: "Fev", interactions: 6 },
  { month: "Mar", interactions: 4 },
  { month: "Abr", interactions: 8 },
  { month: "Mai", interactions: 5 },
  { month: "Jun", interactions: 9 },
];

const ClientDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tenant, setTenant] = useState<Tables<"tenants"> | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadTenant = async () => {
      if (!id) return;
      setIsLoading(true);
      const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (!error) {
        setTenant(data);
      }
      setIsLoading(false);
    };

    loadTenant();
  }, [id]);

  useEffect(() => {
    document.title = tenant ? `DromeFlow – ${tenant.name}` : "DromeFlow – Cliente";
  }, [tenant]);

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-[hsl(var(--df-muted-deep))] to-[hsl(var(--df-hero-accent))]">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <DashboardHeader email={user?.email ?? ""} />
            <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 pb-10 pt-6">
              <p className="text-sm text-muted-foreground">Carregando cliente...</p>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  if (!tenant) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-[hsl(var(--df-muted-deep))] to-[hsl(var(--df-hero-accent))]">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <DashboardHeader email={user?.email ?? ""} />
            <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 pb-10 pt-6">
              <p className="text-sm text-muted-foreground">Cliente não encontrado.</p>
              <Button variant="outline" onClick={() => navigate("/clients")}>
                Voltar para lista de clientes
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
                <p className="df-badge-soft w-fit">Cliente (Tenant)</p>
                <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  {tenant.name}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Slug: {tenant.slug} • Plano: {tenant.plan ?? "starter"} • Criado em{" "}
                  {tenant.created_at ? new Date(tenant.created_at).toLocaleDateString("pt-BR") : "—"}
                </p>
              </div>
            </section>

            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList>
                <TabsTrigger value="overview">Resumo</TabsTrigger>
                <TabsTrigger value="metrics">Métricas</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-4">
                <Card>
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                    <CardTitle className="text-sm font-semibold">Informações gerais</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    <p>
                      <span className="font-medium">Status:</span> {tenant.status ?? "active"}
                    </p>
                    {tenant.billing_email && (
                      <p>
                        <span className="font-medium">Email de cobrança:</span> {tenant.billing_email}
                      </p>
                    )}
                    {tenant.subscription_id && (
                      <p>
                        <span className="font-medium">Assinatura:</span> {tenant.subscription_id}
                      </p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="metrics">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm font-semibold">Histórico de interações</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ChartContainer config={chartConfig} className="h-72 w-full">
                      <LineChart data={fakeData} margin={{ left: 12, right: 12, top: 12, bottom: 12 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border)/0.6)" />
                        <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" />
                        <YAxis stroke="hsl(var(--muted-foreground))" allowDecimals={false} />
                        <ChartTooltip content={<ChartTooltipContent labelKey="month" nameKey="interactions" />} />
                        <Line
                          type="monotone"
                          dataKey="interactions"
                          stroke="var(--color-interactions)"
                          strokeWidth={2}
                          dot={{ r: 3 }}
                        />
                      </LineChart>
                    </ChartContainer>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ClientDetailPage;

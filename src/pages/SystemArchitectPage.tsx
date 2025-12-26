import { useEffect } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useAuth } from "@/context/AuthContext";

const SystemArchitectPage = () => {
  const { user } = useAuth();

  useEffect(() => {
    document.title = "DromeFlow – System Architect";
  }, []);

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-[hsl(var(--df-muted-deep))] to-[hsl(var(--df-hero-accent))]">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader email={user?.email ?? ""} />
          <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 pb-10 pt-6">
            <section className="df-hero-surface">
              <div className="relative flex flex-col gap-3 px-6 py-6 md:px-8 md:py-7">
                <p className="df-badge-soft w-fit">System Architect</p>
                <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
                  Área de estruturação de sistemas
                </h1>
                <p className="text-sm text-muted-foreground">
                  Aqui você poderá desenhar sistemas alvo, integrações e automações com base nos processos mapeados.
                </p>
              </div>
            </section>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default SystemArchitectPage;

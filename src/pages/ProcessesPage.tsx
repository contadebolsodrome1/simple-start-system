import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ProcessCard } from "@/components/ProcessCard";
import { ProcessFormDialog } from "@/components/ProcessFormDialog";
import type { Process } from "@/types/process";
import { loadProcesses, saveProcesses } from "@/lib/processesStorage";
import { loadClients } from "@/lib/clientsStorage";
import type { Client } from "@/types/client";

const ProcessesPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [processes, setProcesses] = useState<Process[]>(() => loadProcesses());
  const [clients, setClients] = useState<Client[]>(() => loadClients());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProcess, setEditingProcess] = useState<Process | null>(null);

  useEffect(() => {
    document.title = "DromeFlow – Processos";
  }, []);

  const handleSaveProcess = (process: Process) => {
    setProcesses((prev) => {
      const exists = prev.some((p) => p.id === process.id);
      const updated = exists ? prev.map((p) => (p.id === process.id ? process : p)) : [process, ...prev];
      saveProcesses(updated);
      return updated;
    });
    setIsFormOpen(false);
    setEditingProcess(null);
  };

  const openNew = () => {
    setEditingProcess(null);
    setIsFormOpen(true);
  };

  const openDetail = (id: string) => {
    navigate(`/processes/${id}`);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-[hsl(var(--df-muted-deep))] to-[hsl(var(--df-hero-accent))]">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader email={user?.email ?? ""} onNewIdea={openNew} />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pb-10 pt-6">
            <section className="df-hero-surface animate-df-fade-up">
              <div className="relative flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-7">
                <div className="space-y-2 md:space-y-3">
                  <p className="df-badge-soft w-fit">Mapa de processos</p>
                  <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                    Processos mapeados para automação.
                  </h1>
                  <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                    Organize fluxos complexos por cliente e identifique rapidamente onde focar esforços de automação.
                  </p>
                </div>
                <div className="mt-3 flex flex-col gap-2 md:mt-0 md:items-end">
                  <Button
                    variant="default"
                    size="lg"
                    className="shadow-[0_10px_30px_-18px_hsl(var(--df-shadow-strong))]"
                    onClick={openNew}
                  >
                    + Novo Processo
                  </Button>
                  <p className="text-xs text-muted-foreground">Comece mapeando o fluxo crítico de um cliente.</p>
                </div>
              </div>
            </section>

            <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {processes.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhum processo mapeado ainda. Clique em "+ Novo Processo" para registrar o primeiro fluxo.
                </p>
              ) : (
                processes.map((process) => (
                  <ProcessCard key={process.id} process={process} onOpen={() => openDetail(process.id)} />
                ))
              )}
            </section>
          </main>
        </div>
      </div>

      <ProcessFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        clients={clients}
        initialProcess={editingProcess}
        onSave={handleSaveProcess}
      />
    </SidebarProvider>
  );
};

export default ProcessesPage;

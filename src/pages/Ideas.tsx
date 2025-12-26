import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { IdeaCard } from "@/components/IdeaCard";
import { IdeaFormDialog } from "@/components/IdeaFormDialog";
import { PhaseTransitionDialog } from "@/components/PhaseTransitionDialog";
import type { Idea, IdeaPhase } from "@/types/idea";
import { loadIdeas, saveIdea, deleteIdea } from "@/lib/ideasStorage";
import { Permissions } from "@/lib/roles";
import { useToast } from "@/hooks/use-toast";

const IdeasPage = () => {
  const { user, tenantId, userRole } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingIdea, setEditingIdea] = useState<Idea | null>(null);
  const [transitioningIdea, setTransitioningIdea] = useState<Idea | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "DromeFlow – Ideias";
    
    if (!tenantId) {
      console.warn("No tenantId available, skipping ideas load");
      setLoading(false);
      return;
    }
    
    loadIdeas(tenantId).then((data) => {
      setIdeas(data);
      setLoading(false);
    });
  }, [tenantId]);

  const handleSaveIdea = async (payload: {
    id?: string;
    title: string;
    description?: string;
    current_phase: IdeaPhase;
    category: Idea["category"];
    tags: string[];
  }) => {
    if (!tenantId || !user) {
      toast({ title: "Erro", description: "Você precisa estar logado.", variant: "destructive" });
      return;
    }

    const savedIdea = await saveIdea(tenantId, user.id, payload);

    if (savedIdea) {
      if (payload.id) {
        setIdeas((prev) => prev.map((idea) => (idea.id === savedIdea.id ? savedIdea : idea)));
        toast({ title: "Sucesso", description: "Ideia atualizada." });
      } else {
        setIdeas((prev) => [savedIdea, ...prev]);
        toast({ title: "Sucesso", description: "Ideia criada." });
      }
      setIsFormOpen(false);
      setEditingIdea(null);
    } else {
      toast({ title: "Erro", description: "Não foi possível salvar a ideia.", variant: "destructive" });
    }
  };

  const handleDeleteIdea = async (id: string) => {
    if (!tenantId) {
      toast({ title: "Erro", description: "Você precisa estar logado.", variant: "destructive" });
      return;
    }

    const success = await deleteIdea(tenantId, id);

    if (success) {
      setIdeas((prev) => prev.filter((idea) => idea.id !== id));
      toast({ title: "Sucesso", description: "Ideia excluída." });
    } else {
      toast({ title: "Erro", description: "Não foi possível excluir a ideia.", variant: "destructive" });
    }
  };

  const handleConfirmPhase = async (nextPhase: IdeaPhase) => {
    if (!transitioningIdea || !tenantId || !user) return;

    const updated = await saveIdea(tenantId, user.id, {
      ...transitioningIdea,
      current_phase: nextPhase,
    });

    if (updated) {
      setIdeas((prev) => prev.map((idea) => (idea.id === updated.id ? updated : idea)));
      toast({ title: "Sucesso", description: "Fase atualizada." });
    } else {
      toast({ title: "Erro", description: "Não foi possível atualizar a fase.", variant: "destructive" });
    }

    setTransitioningIdea(null);
  };

  if (loading) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <DashboardHeader email={user?.email ?? ""} onNewIdea={() => {}} />
          <div className="flex items-center justify-center h-[calc(100vh-80px)]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Carregando ideias...</p>
            </div>
          </div>
        </main>
      </SidebarProvider>
    );
  }

  if (!tenantId) {
    return (
      <SidebarProvider>
        <AppSidebar />
        <main className="flex-1">
          <DashboardHeader email={user?.email ?? ""} onNewIdea={() => {}} />
          <div className="flex items-center justify-center h-[calc(100vh-80px)]">
            <div className="text-center max-w-md p-8">
              <div className="text-red-500 text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold mb-2">Erro ao carregar workspace</h2>
              <p className="text-muted-foreground mb-4">
                Não foi possível acessar seu workspace. Por favor, faça logout e login novamente.
              </p>
              <button 
                onClick={() => window.location.href = '/auth'}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Ir para Login
              </button>
            </div>
          </div>
        </main>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-[hsl(var(--df-muted-deep))] to-[hsl(var(--df-hero-accent))]">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader email={user?.email ?? ""} onNewIdea={() => { setEditingIdea(null); setIsFormOpen(true); }} />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pb-10 pt-6">

            <section className="mt-4 flex gap-4 overflow-x-auto pb-2">
              {(["conception", "validation", "structuring", "implementation"] as IdeaPhase[]).map((phase) => {
                const ideasInPhase = ideas.filter((idea) => idea.current_phase === phase);

                const phaseLabels: Record<IdeaPhase, string> = {
                  conception: "Concepção",
                  validation: "Validação",
                  structuring: "Estruturação",
                  implementation: "Implantação",
                };

                return (
                  <div key={phase} className="min-w-[260px] flex-1">
                    <div className="mb-3 flex items-center justify-between gap-2">
                      <h2 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        {phaseLabels[phase]}
                      </h2>
                      <span className="rounded-full bg-muted px-2 py-0.5 text-[11px] text-muted-foreground">
                        {ideasInPhase.length}
                      </span>
                    </div>

                    <div className="space-y-3">
                      {ideasInPhase.length === 0 ? (
                        <p className="text-[11px] text-muted-foreground/80">
                          Nenhuma ideia nesta fase ainda.
                        </p>
                      ) : (
                        ideasInPhase.map((idea) => (
                          <IdeaCard
                            key={idea.id}
                            idea={idea}
                            onEdit={() => {
                              setEditingIdea(idea);
                              setIsFormOpen(true);
                            }}
                            onTransitionPhase={() => setTransitioningIdea(idea)}
                            onDelete={() => handleDeleteIdea(idea.id)}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </section>
          </main>
        </div>
      </div>

      <IdeaFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialIdea={editingIdea}
        onSave={handleSaveIdea}
      />

      <PhaseTransitionDialog
        open={!!transitioningIdea}
        onOpenChange={(open) => {
          if (!open) setTransitioningIdea(null);
        }}
        idea={transitioningIdea}
        onConfirm={handleConfirmPhase}
      />
    </SidebarProvider>
  );
};

export default IdeasPage;

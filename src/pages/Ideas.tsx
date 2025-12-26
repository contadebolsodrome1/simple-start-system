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
            <section className="df-hero-surface animate-df-fade-up">
              <div className="relative flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-7">
                <div className="space-y-2 md:space-y-3">
                  <p className="df-badge-soft w-fit">Pipeline de ideias</p>
                  <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                    Ideias em diferentes fases de maturidade.
                  </h1>
                  <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                    Centralize iniciativas em Concepção, Validação, Estruturação e Implantação para ter clareza do funil.
                  </p>
                </div>
                <div className="mt-3 flex flex-col gap-2 md:mt-0 md:items-end">
                  <Button
                    variant="default"
                    size="lg"
                    className="shadow-[0_10px_30px_-18px_hsl(var(--df-shadow-strong))]"
                    onClick={() => { setEditingIdea(null); setIsFormOpen(true); }}
                  >
                    + Nova Ideia
                  </Button>
                  <p className="text-xs text-muted-foreground">Comece registrando a próxima automação crítica.</p>
                </div>
              </div>
            </section>

            <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {ideas.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  Nenhuma ideia cadastrada ainda. Clique em "+ Nova Ideia" para começar a montar seu pipeline.
                </p>
              ) : (
                ideas.map((idea) => (
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

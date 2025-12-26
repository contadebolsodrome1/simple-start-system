import { useEffect, useMemo, useRef, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useKeys } from "@/hooks/useKeys";
import { KeysList } from "@/components/Keys/KeysList";
import { KeyForm } from "@/components/Keys/KeyForm";
import { KeySearch } from "@/components/Keys/KeySearch";
import { KeyFilters } from "@/components/Keys/KeyFilters";
import { KeyHistory } from "@/components/Keys/KeyHistory";
import { KeyExportImport } from "@/components/Keys/KeyExportImport";
import type { Secret, Tag, Tool } from "@/types/Secret";
import { KeyRound, Download } from "lucide-react";
import { loadClients } from "@/lib/clientsStorage";
import { Permissions } from "@/lib/roles";
import { toast } from "@/components/ui/use-toast";

interface ClientOption {
  id: string;
  name: string;
}

const DEFAULT_TOOLS: Tool[] = [
  {
    id: "stripe",
    name: "Stripe",
    icon: "💳",
    key_types: ["api_key", "webhook_secret", "oauth"],
    color: "#5469d4",
    description: "Processamento de pagamentos",
    docs_url: "https://stripe.com/docs",
  },
  {
    id: "n8n",
    name: "n8n",
    icon: "⚙️",
    key_types: ["token", "api_key", "oauth"],
    color: "#ff6d5a",
    description: "Automação de workflows",
    docs_url: "https://docs.n8n.io",
  },
  {
    id: "evolution",
    name: "Evolution API",
    icon: "💬",
    key_types: ["api_key", "connection_string", "token"],
    color: "#25d366",
    description: "Integração WhatsApp",
    docs_url: "https://evolution-api.io",
  },
  {
    id: "supabase",
    name: "Supabase",
    icon: "🗄️",
    key_types: ["api_key", "connection_string", "service_role_key"],
    color: "#3ecf8e",
    description: "Database e backend",
    docs_url: "https://supabase.io/docs",
  },
  {
    id: "sendgrid",
    name: "SendGrid",
    icon: "📧",
    key_types: ["api_key"],
    color: "#0099ff",
    description: "Serviço de email",
    docs_url: "https://sendgrid.com/docs",
  },
  {
    id: "mercado_pago",
    name: "Mercado Pago",
    icon: "💰",
    key_types: ["api_key", "access_token"],
    color: "#00b1e5",
    description: "Pagamentos e transferências",
    docs_url: "https://developer.mercadopago.com",
  },
  {
    id: "typebot",
    name: "Typebot",
    icon: "🤖",
    key_types: ["api_key", "token"],
    color: "#9333ea",
    description: "Chatbots e conversação",
    docs_url: "https://typebot.io/docs",
  },
];

const DEFAULT_TAGS: Tag[] = [
  {
    id: "producao",
    name: "Produção",
    color: "#ef4444",
    description: "Chaves em uso em produção",
  },
  {
    id: "staging",
    name: "Staging",
    color: "#f59e0b",
    description: "Ambiente de testes pré-produção",
  },
  {
    id: "teste",
    name: "Teste",
    color: "#3b82f6",
    description: "Ambiente de desenvolvimento/testes",
  },
  {
    id: "deprecated",
    name: "Descontinuado",
    color: "#6b7280",
    description: "Chaves antigas, não usar mais",
  },
  {
    id: "critical",
    name: "Crítica",
    color: "#8b5cf6",
    description: "Chave crítica para operações",
  },
  {
    id: "backup",
    name: "Backup",
    color: "#06b6d4",
    description: "Chave de backup/fallback",
  },
];

const KeysPage = () => {
  const { user, userRole } = useAuth();
  const {
    secrets,
    filteredSecrets,
    createSecret,
    updateSecret,
    deleteSecret,
    copyToClipboard,
    revealSecret,
    hideSecret,
    setFilters: setRemoteFilters,
    exportSecrets,
    importSecrets,
    getSecretStats,
  } = useKeys();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editing, setEditing] = useState<Secret | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historySecret, setHistorySecret] = useState<Secret | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Secret | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const [filters, setFilters] = useState<{
    tool?: string;
    tags?: string[];
    client_id?: string;
    showExpired?: boolean;
    showInactive?: boolean;
    searchQuery?: string;
  }>({
    tool: undefined,
    tags: [],
    client_id: undefined,
    showExpired: false,
    showInactive: false,
    searchQuery: "",
  });

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    document.title = "DromeFlow – Keys & Secrets";
  }, []);

  const clients: ClientOption[] = useMemo(() => {
    try {
      const raw = loadClients();
      return raw.map((c) => ({ id: c.id, name: c.name }));
    } catch {
      return [];
    }
  }, []);

  const clientOptions: ClientOption[] = useMemo(
    () => [{ id: "generico", name: "Genérico" }, ...clients],
    [clients],
  );

  const canCreate = userRole ? Permissions.canManageSecrets(userRole) : false;
  const canView = userRole ? Permissions.canViewSecrets(userRole) : false;
  const handleNew = () => {
    setEditing(null);
    setIsFormOpen(true);
  };

  const handleEdit = (secret: Secret) => {
    setEditing(secret);
    setIsFormOpen(true);
  };

  const handleSubmit = (data: Omit<Secret, "id" | "created_at" | "updated_at">) => {
    const createdBy = user?.email ?? "user-001";
    if (editing) {
      updateSecret(editing.id, { ...data, created_by: createdBy });
    } else {
      createSecret({ ...data, created_by: createdBy });
    }
    setIsFormOpen(false);
    toast({
      title: editing ? "Chave atualizada" : "Chave criada",
      description: "Os dados foram armazenados no painel local de secrets.",
    });
  };

  const handleToggleVisibility = (secret: Secret) => {
    if (secret.visibility === "visible") hideSecret(secret.id);
    else revealSecret(secret.id);
  };

  const handleCopy = async (secret: Secret) => {
    await copyToClipboard(secret.id);
  };

  const handleRequestDelete = (secret: Secret) => {
    setDeleteTarget(secret);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) return;
    deleteSecret(deleteTarget.id);
    setDeleteOpen(false);
    toast({ title: "Chave removida", description: "Esta chave foi excluída do painel local." });
  };

  const handleShowHistory = (secret: Secret) => {
    setHistorySecret(secret);
    setHistoryOpen(true);
  };

  const handleExport = () => {
    // senha simulada vazia por enquanto
    // você pode passar uma string fixa aqui se quiser testar a mensagem
    // ex: exportSecrets("minha-senha-secreta");
    // por padrão, usamos string vazia
    // para enfatizar que é apenas simulação
    // e que a senha real deve ser tratada fora do sistema
    // no futuro backend
    // eslint-disable-next-line no-useless-call
    // apenas chamamos sem senha
    // exportSecrets("");
    // para manter o comportamento antigo (download direto), chamamos com vazio:
    exportSecrets("");
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    await importSecrets(file, "");
    event.target.value = "";
  };

  if (!canView) {
    return (
      <SidebarProvider>
        <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-[hsl(var(--df-muted-deep))] to-[hsl(var(--df-hero-accent))]">
          <AppSidebar />
          <div className="flex flex-1 flex-col">
            <DashboardHeader email={user?.email ?? ""} />
            <main className="mx-auto flex w-full max-w-4xl flex-1 flex-col gap-4 px-4 pb-10 pt-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm font-semibold">Acesso restrito</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm text-muted-foreground">
                  <p>Você não tem permissão para acessar o painel de chaves e secrets.</p>
                  <p className="text-xs">Apenas perfis Admin, Manager e Analyst podem visualizar este módulo.</p>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }


  const stats = getSecretStats();

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-[hsl(var(--df-muted-deep))] to-[hsl(var(--df-hero-accent))]">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader email={user?.email ?? ""} />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pb-10 pt-6">

            <section className="space-y-4">
              <KeyFilters
                tools={DEFAULT_TOOLS}
                tags={DEFAULT_TAGS}
                clients={clientOptions}
                filters={filters}
                onChange={(next) => {
                  setFilters(next);
                  setRemoteFilters(next);
                }}
                rightSlot={
                  <div className="flex items-center gap-2">
                    <KeySearch
                      query={filters.searchQuery ?? ""}
                      onChange={(value) => {
                        const next = { ...filters, searchQuery: value };
                        setFilters(next);
                        setRemoteFilters(next);
                      }}
                      resultsCount={filteredSecrets.length}
                    />
                    <Button
                      variant="outline"
                      size="icon"
                      className="shrink-0"
                      onClick={() => setExportDialogOpen(true)}
                      aria-label="Exportar ou importar chaves"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                }
              />

              <div className="space-y-3">
                <KeysList
                  secrets={filteredSecrets}
                  tools={DEFAULT_TOOLS}
                  tags={DEFAULT_TAGS}
                  onEdit={handleEdit}
                  onRequestDelete={handleRequestDelete}
                  onShowHistory={handleShowHistory}
                  onToggleVisibility={handleToggleVisibility}
                  onCopy={handleCopy}
                />
              </div>

              <input
                type="file"
                accept="application/json"
                className="hidden"
                ref={fileInputRef}
                onChange={handleImportFile}
              />
            </section>
          </main>
        </div>
      </div>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        {isFormOpen && (
          <KeyForm
            initial={editing}
            tools={DEFAULT_TOOLS}
            tags={DEFAULT_TAGS}
            clients={clients}
            onSubmit={handleSubmit as any}
            onClose={() => setIsFormOpen(false)}
          />
        )}
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Deletar chave</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja deletar a chave {deleteTarget?.name}? Esta ação é irreversível nesta simulação.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction className="bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] hover:bg-[hsl(var(--destructive)/0.9))]" onClick={confirmDelete}>
              Deletar permanentemente
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={historyOpen} onOpenChange={setHistoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Histórico de acesso</DialogTitle>
            <DialogDescription>
              Registro de criação, modificações e cópias desta chave dentro do painel.
            </DialogDescription>
          </DialogHeader>
          <KeyHistory secret={historySecret} />
        </DialogContent>
      </Dialog>

      <Dialog open={exportDialogOpen} onOpenChange={setExportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Exportar ou importar chaves</DialogTitle>
            <DialogDescription>
              Exporte ou importe um arquivo JSON apenas com dados de desenvolvimento (modo simulado).
            </DialogDescription>
          </DialogHeader>
          <KeyExportImport onExport={handleExport} onImport={handleImportClick} />
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default KeysPage;

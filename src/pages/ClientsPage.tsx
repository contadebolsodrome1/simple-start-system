import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ClientCard } from "@/components/ClientCard";
import { ClientFormDialog } from "@/components/ClientFormDialog";
import type { Client } from "@/types/client";
import { loadClients, saveClients } from "@/lib/clientsStorage";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Permissions } from "@/lib/roles";

const ClientsPage = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [clients, setClients] = useState<Client[]>(() => loadClients());
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  useEffect(() => {
    document.title = "DromeFlow – Clientes";
  }, []);

  const handleSaveClient = (client: Client) => {
    setClients((prev) => {
      const exists = prev.some((c) => c.id === client.id);
      const updated = exists ? prev.map((c) => (c.id === client.id ? client : c)) : [client, ...prev];
      saveClients(updated);
      return updated;
    });
    setIsFormOpen(false);
    setEditingClient(null);
  };

  const handleOpenNew = () => {
    setEditingClient(null);
    setIsFormOpen(true);
  };

  const openDetail = (id: string) => {
    navigate(`/clients/${id}`);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-[hsl(var(--df-muted-deep))] to-[hsl(var(--df-hero-accent))]">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader email={user?.email ?? ""} onNewIdea={handleOpenNew} />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pb-10 pt-6">

            <section className="space-y-4">
              <div className="overflow-x-auto rounded-lg border bg-card/80">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>CNPJ</TableHead>
                      <TableHead>Indústria</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data criação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clients.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                          Nenhum cliente cadastrado ainda.
                        </TableCell>
                      </TableRow>
                    ) : (
                      clients.map((client) => (
                        <TableRow
                          key={client.id}
                          className="cursor-pointer hover:bg-muted/60"
                          onClick={() => openDetail(client.id)}
                        >
                          <TableCell className="font-medium">{client.name}</TableCell>
                          <TableCell>{client.cnpj || "—"}</TableCell>
                          <TableCell>{client.industry || "—"}</TableCell>
                          <TableCell className="capitalize">{client.status}</TableCell>
                          <TableCell>{client.created_at}</TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>

              {clients.length > 0 && (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {clients.map((client) => (
                    <ClientCard key={client.id} client={client} onOpen={() => openDetail(client.id)} />
                  ))}
                </div>
              )}
            </section>
          </main>
        </div>
      </div>

      <ClientFormDialog
        open={isFormOpen}
        onOpenChange={setIsFormOpen}
        initialClient={editingClient}
        onSave={handleSaveClient}
      />
    </SidebarProvider>
  );
};

export default ClientsPage;

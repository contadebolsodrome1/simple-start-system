import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import type { Tables } from "@/integrations/supabase/types";
import { supabase } from "@/integrations/supabase/client";

const ClientsPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [tenants, setTenants] = useState<Tables<"tenants">[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    document.title = "DromeFlow – Clientes";
  }, []);

  useEffect(() => {
    const loadTenants = async () => {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("tenants")
        .select("*")
        .order("created_at", { ascending: false });

      if (!error && data) {
        setTenants(data);
      }
      setIsLoading(false);
    };

    loadTenants();
  }, []);

  const openDetail = (id: string) => {
    navigate(`/clients/${id}`);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-[hsl(var(--df-muted-deep))] to-[hsl(var(--df-hero-accent))]">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader email={user?.email ?? ""} />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pb-10 pt-6">
            <section className="space-y-4">
              <div className="overflow-x-auto rounded-lg border bg-card/80">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Nome</TableHead>
                      <TableHead>Slug</TableHead>
                      <TableHead>Plano</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data criação</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {isLoading ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                          Carregando clientes...
                        </TableCell>
                      </TableRow>
                    ) : tenants.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                          Nenhum cliente cadastrado ainda.
                        </TableCell>
                      </TableRow>
                    ) : (
                      tenants.map((tenant) => (
                        <TableRow
                          key={tenant.id}
                          className="cursor-pointer hover:bg-muted/60"
                          onClick={() => openDetail(tenant.id)}
                        >
                          <TableCell className="font-medium">{tenant.name}</TableCell>
                          <TableCell>{tenant.slug}</TableCell>
                          <TableCell className="capitalize">{tenant.plan ?? "starter"}</TableCell>
                          <TableCell className="capitalize">{tenant.status ?? "active"}</TableCell>
                          <TableCell>
                            {tenant.created_at
                              ? new Date(tenant.created_at).toLocaleDateString("pt-BR")
                              : "—"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </section>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default ClientsPage;

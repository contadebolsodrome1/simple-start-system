import { useEffect, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useNavigate } from "react-router-dom";
import type { AppUser } from "@/types/user";
import { loadUsers, saveUsers } from "@/lib/usersStorage";
import { Permissions, ROLE_LABELS } from "@/lib/roles";

const UsersPage = () => {
  const { user, userRole } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<AppUser[]>(() => loadUsers());
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteName, setInviteName] = useState("");
  const [inviteRole, setInviteRole] = useState<keyof typeof ROLE_LABELS>("manager");

  useEffect(() => {
    document.title = "DromeFlow – Usuários";
  }, []);

  useEffect(() => {
    if (!user || !userRole) return;
    if (users.length === 0) {
      const today = new Date().toISOString().slice(0, 10);
      const seed: AppUser = {
        id: crypto.randomUUID(),
        email: user.email,
        name: user.email.split("@")[0] ?? "Admin",
        role: userRole,
        status: "active",
        created_at: today,
      };
      setUsers([seed]);
      saveUsers([seed]);
    }
  }, [user, users.length, userRole]);

  if (userRole && !Permissions.canManageUsers(userRole)) {
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
                  <p>Você não tem permissão para acessar o painel de usuários.</p>
                  <p className="text-xs">Apenas perfis com papel Admin podem gerenciar usuários.</p>
                  <Button variant="outline" size="sm" onClick={() => navigate("/")}>
                    Voltar para o dashboard
                  </Button>
                </CardContent>
              </Card>
            </main>
          </div>
        </div>
      </SidebarProvider>
    );
  }

  const handleInvite = () => {
    if (!inviteEmail.trim() || !inviteName.trim()) return;
    const today = new Date().toISOString().slice(0, 10);
    const newUser: AppUser = {
      id: crypto.randomUUID(),
      email: inviteEmail.trim(),
      name: inviteName.trim(),
      role: inviteRole,
      status: "invited",
      created_at: today,
    };
    const updated = [newUser, ...users];
    setUsers(updated);
    saveUsers(updated);
    setInviteEmail("");
    setInviteName("");
    setInviteRole("manager");
    setIsInviteOpen(false);
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-[hsl(var(--df-muted-deep))] to-[hsl(var(--df-hero-accent))]">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader email={user?.email ?? ""} />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 pb-10 pt-6">
            <section className="df-hero-surface animate-df-fade-up">
              <div className="relative flex flex-col gap-4 px-6 py-6 md:flex-row md:items-center md:justify-between md:px-8 md:py-7">
                <div className="space-y-2 md:space-y-3">
                  <p className="df-badge-soft w-fit">Governança de acesso</p>
                  <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                    Usuários e perfis de acesso.
                  </h1>
                  <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                    Controle quem pode criar ideias, editar clientes, mapear processos e orquestrar automações.
                  </p>
                </div>
                <div className="mt-3 flex flex-col gap-2 md:mt-0 md:items-end">
                  <Button
                    variant="default"
                    size="lg"
                    className="shadow-[0_10px_30px_-18px_hsl(var(--df-shadow-strong))]"
                    onClick={() => setIsInviteOpen(true)}
                  >
                    + Convidar Usuário
                  </Button>
                  <p className="text-xs text-muted-foreground">Convide admins, managers, analysts ou viewers para o workspace.</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <div className="overflow-x-auto rounded-lg border bg-card/80">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Nome</TableHead>
                      <TableHead>Perfil</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Data entrada</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
                          Nenhum usuário cadastrado ainda.
                        </TableCell>
                      </TableRow>
                    ) : (
                      users.map((u) => (
                        <TableRow key={u.id}>
                          <TableCell className="font-medium">{u.email}</TableCell>
                          <TableCell>{u.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-[11px]">
                              {ROLE_LABELS[u.role]}
                            </Badge>
                          </TableCell>
                          <TableCell className="capitalize text-xs">
                            {u.status === "active" ? "Ativo" : "Convidado"}
                          </TableCell>
                          <TableCell>{u.created_at}</TableCell>
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

      <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Convidar Usuário</DialogTitle>
            <DialogDescription>
              Informe os dados básicos do usuário e defina o perfil de acesso. O convite é simulado nesta versão.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label htmlFor="invite-email">Email</Label>
              <Input
                id="invite-email"
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="usuario@empresa.com"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="invite-name">Nome</Label>
              <Input
                id="invite-name"
                value={inviteName}
                onChange={(e) => setInviteName(e.target.value)}
                placeholder="Nome completo ou apelido"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Perfil</Label>
              <Select value={inviteRole} onValueChange={(v: keyof typeof ROLE_LABELS) => setInviteRole(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o perfil" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin – acesso total</SelectItem>
                  <SelectItem value="manager">Manager – operação e automações</SelectItem>
                  <SelectItem value="analyst">Analyst – somente leitura</SelectItem>
                  <SelectItem value="viewer">Viewer – dashboard apenas</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button variant="outline" size="sm" onClick={() => setIsInviteOpen(false)}>
              Cancelar
            </Button>
            <Button size="sm" onClick={handleInvite} disabled={!inviteEmail.trim() || !inviteName.trim()}>
              Convidar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default UsersPage;

import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import { Briefcase, Lightbulb, Workflow, WorkflowIcon, Zap, User, KeyRound } from "lucide-react";

const AppSidebar = () => {
  return (
    <Sidebar collapsible="icon" className="border-r">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Visão Geral</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/"
                    end
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    activeClassName="bg-[hsl(var(--accent)/0.4)] text-foreground font-medium"
                  >
                    <Workflow className="h-4 w-4" />
                    <span>Dashboard</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/ideas"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    activeClassName="bg-[hsl(var(--accent)/0.4)] text-foreground font-medium"
                  >
                    <Lightbulb className="h-4 w-4" />
                    <span>Ideias</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/clients"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    activeClassName="bg-[hsl(var(--accent)/0.4)] text-foreground font-medium"
                  >
                    <Briefcase className="h-4 w-4" />
                    <span>Clientes</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/processes"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    activeClassName="bg-[hsl(var(--accent)/0.4)] text-foreground font-medium"
                  >
                    <WorkflowIcon className="h-4 w-4" />
                    <span>Processos</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/automations"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    activeClassName="bg-[hsl(var(--accent)/0.4)] text-foreground font-medium"
                  >
                    <Zap className="h-4 w-4" />
                    <span>Automações</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/keys"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    activeClassName="bg-[hsl(var(--accent)/0.4)] text-foreground font-medium"
                  >
                    <KeyRound className="h-4 w-4" />
                    <span>Keys & Secrets</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <NavLink
                    to="/users"
                    className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
                    activeClassName="bg-[hsl(var(--accent)/0.4)] text-foreground font-medium"
                  >
                    <User className="h-4 w-4" />
                    <span>Usuários</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;

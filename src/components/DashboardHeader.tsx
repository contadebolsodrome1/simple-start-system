import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Lightbulb, LogOut, Menu, User, Shield } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ROLE_LABELS } from "@/lib/roles";

interface DashboardHeaderProps {
  email: string;
  onNewIdea?: () => void;
}

const DashboardHeader = ({ email, onNewIdea }: DashboardHeaderProps) => {
  const { signOut, userRole } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate("/auth", { replace: true });
  };

  return (
    <header className="flex h-16 items-center border-b bg-card/80 px-4 backdrop-blur-sm md:px-6">
      <div className="flex flex-1 items-center gap-3">
        <SidebarTrigger className="mr-1 md:mr-2" />
        <Menu className="h-5 w-5 text-[hsl(var(--primary))] md:hidden" />
        <span className="text-base font-semibold tracking-tight text-foreground md:text-lg">
          <span className="rounded-md bg-[hsl(var(--primary)/0.08)] px-2 py-1 text-[0.8rem] uppercase tracking-[0.18em] text-[hsl(var(--primary))]">
            Drome
          </span>
          <span className="ml-1 text-muted-foreground">Flow</span>
        </span>
      </div>
      <div className="flex items-center gap-3">
        {onNewIdea && (
          <Button variant="default" size="sm" className="hidden shadow-[0_10px_30px_-18px_hsl(var(--df-shadow-strong))] md:inline-flex" onClick={onNewIdea}>
            <Lightbulb className="mr-2 h-4 w-4" />
            + Nova Ideia
          </Button>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden text-xs font-medium sm:inline">{email || "Usuário"}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="mt-1 min-w-[12rem]">
            <DropdownMenuLabel>Perfil do Usuário</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled className="text-xs text-muted-foreground">
              {email || "Sem email definido"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default DashboardHeader;

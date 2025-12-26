import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { KeyRound, AlertTriangle, Ghost } from "lucide-react";

interface KeyStatsProps {
  total: number;
  expiringSoon: number;
  expired: number;
  inactive: number;
}

export const KeyStats = ({ total, expiringSoon, expired, inactive }: KeyStatsProps) => {
  return (
    <div className="space-y-4">
      <Card className="df-stat-card">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Visão geral
          </CardTitle>
          <KeyRound className="h-4 w-4 text-[hsl(var(--primary))]" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-baseline justify-between">
            <span className="text-sm text-muted-foreground">Total de chaves</span>
            <span className="text-xl font-semibold tracking-tight">{total}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-[11px]">
            <div className="rounded-lg bg-[hsl(var(--accent)/0.3)] px-2 py-1.5 text-[hsl(var(--accent-foreground))]">
              <p>Por expirar</p>
              <p className="text-sm font-semibold">{expiringSoon}</p>
            </div>
            <div className="rounded-lg bg-[hsl(var(--destructive)/0.08)] px-2 py-1.5 text-[hsl(var(--destructive))]">
              <p>Expiradas</p>
              <p className="text-sm font-semibold">{expired}</p>
            </div>
            <div className="rounded-lg bg-[hsl(var(--muted))] px-2 py-1.5 text-muted-foreground">
              <p>Inativas</p>
              <p className="text-sm font-semibold">{inactive}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-dashed border-[hsl(var(--accent))]/60 bg-card/70">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Boas práticas
          </CardTitle>
          <AlertTriangle className="h-4 w-4 text-[hsl(var(--destructive))]" />
        </CardHeader>
        <CardContent className="space-y-2 text-[11px] text-muted-foreground">
          <p>• Nunca reutilize chaves sensíveis entre ambientes.</p>
          <p>• Prefira variáveis de ambiente seguras em produção.</p>
          <p>• Use este painel apenas para orquestração e documentação.</p>
        </CardContent>
      </Card>

      <Card className="border bg-card/70">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
            Modo simulado
          </CardTitle>
          <Ghost className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent className="space-y-2 text-[11px] text-muted-foreground">
          <p>
            Este módulo armazena dados apenas no <code>localStorage</code> do navegador. Não use valores reais de produção
            aqui.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

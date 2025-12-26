import { ArrowRight, CheckCircle2, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="app-shell">
      <header className="border-b border-border/60 bg-background/70 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent text-primary-foreground shadow-md">
              <Zap className="h-5 w-5" aria-hidden="true" />
            </div>
            <div className="flex flex-col leading-tight">
              <span className="font-display text-base font-semibold tracking-tight">Sistema Simples</span>
              <span className="text-xs text-muted-foreground">Comece rápido. Cresça no seu ritmo.</span>
            </div>
          </div>

          <div className="hidden items-center gap-3 sm:flex">
            <span className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Primeira versão pronta
            </span>
            <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse-soft" aria-hidden="true" />
          </div>
        </div>
      </header>

      <main className="app-container">
        <section className="grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:items-center">
          <div className="space-y-8">
            <div className="pill">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Sistema simples, pensado para começar hoje</span>
            </div>

            <div className="space-y-4">
              <h1 className="text-balance font-display text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                <span className="gradient-text">Sistema simples</span> para tirar suas ideias do papel.
              </h1>
              <p className="max-w-xl text-balance text-sm text-muted-foreground sm:text-base">
                Uma base moderna em React, pronta para você adaptar: cadastros, painéis, relatórios e tudo mais que seu
                projeto precisar.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Button variant="hero" size="lg">
                Começar protótipo
                <ArrowRight className="ml-1 h-4 w-4" aria-hidden="true" />
              </Button>
              <Button variant="subtle" size="lg">
                Ver ideias de módulos
              </Button>
            </div>

            <div className="grid gap-4 text-sm text-muted-foreground sm:grid-cols-3">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-medium text-foreground">Interface pronta</p>
                  <p className="text-xs text-muted-foreground">Layout responsivo, com tipografia e cores definidas.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-medium text-foreground">Componentes reutilizáveis</p>
                  <p className="text-xs text-muted-foreground">Botões, cards e estrutura para novos módulos.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                <div>
                  <p className="font-medium text-foreground">Base escalável</p>
                  <p className="text-xs text-muted-foreground">Pronto para conectar a banco de dados e login.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-2 lg:mt-0">
            <div className="hero-card group">
              <div className="hero-glow animate-float" aria-hidden="true" />

              <div className="flex items-center justify-between gap-3 pb-4">
                <div>
                  <p className="badge-soft mb-1">Primeiro passo</p>
                  <p className="text-sm font-medium text-muted-foreground">Seu painel inicial</p>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                  Editável via chat
                </span>
              </div>

              <div className="space-y-4 rounded-2xl border border-border/70 bg-background/80 p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>Módulos sugeridos</span>
                  <span>v0.1</span>
                </div>
                <div className="grid gap-3 text-sm">
                  <div className="card-elevated flex items-center justify-between gap-3 bg-gradient-to-r from-primary/5 to-accent/5">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Cadastro</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">Clientes & Produtos</p>
                    </div>
                    <span className="rounded-full bg-primary/15 px-2.5 py-1 text-[11px] font-semibold text-primary">
                      Essencial
                    </span>
                  </div>

                  <div className="card-elevated flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Operações</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">Pedidos & Tarefas</p>
                    </div>
                    <span className="rounded-full bg-muted px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                      Próximo passo
                    </span>
                  </div>

                  <div className="card-elevated flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground">Visão</p>
                      <p className="mt-1 text-sm font-semibold text-foreground">Relatórios simples</p>
                    </div>
                    <span className="rounded-full bg-secondary/25 px-2.5 py-1 text-[11px] font-semibold text-secondary-foreground">
                      Em breve
                    </span>
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                  <p>
                    Dica: use o chat para pedir<br className="hidden sm:inline" /> cada módulo em detalhes.
                  </p>
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 font-medium text-primary">
                    <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                    Interação guiada
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-border/60 bg-background/80">
        <div className="container mx-auto flex flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-muted-foreground sm:flex-row sm:px-6 lg:px-8">
          <p>
            Sistema Simples • Base criada para você adaptar a qualquer tipo de projeto.
          </p>
          <p className="flex items-center gap-1">
            Pronto para o próximo passo? <span className="font-medium text-foreground">Peça novos módulos no chat.</span>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;

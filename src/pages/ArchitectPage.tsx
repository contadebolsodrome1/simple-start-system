import { useEffect, useMemo, useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import AppSidebar from "@/components/AppSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { Client } from "@/types/client";
import type { Process } from "@/types/process";
import { loadClients } from "@/lib/clientsStorage";
import { loadProcesses } from "@/lib/processesStorage";
import type { ArchitectEntity, ArchitectEntityField, ArchitectModule, ArchitectPattern, ArchitectRelation } from "@/types/architect";
import { BlueprintSaveDialog } from "@/components/BlueprintSaveDialog";
import { loadBlueprints, saveBlueprints } from "@/lib/architectStorage";

const suggestedEntities = ["Customer", "Order", "Contact", "Payment", "Product", "Invoice"];

const recommendedModulesSeed: ArchitectModule[] = [
  {
    id: "scheduling",
    name: "Scheduling Module",
    description: "Orquestra agendamentos, lembretes e follow-ups automáticos.",
    version: "1.0.0",
    dependencies: ["Calendaring", "Notifications"],
    enabled: true,
  },
  {
    id: "whatsapp",
    name: "WhatsApp Messaging",
    description: "Canal de mensagens para fluxos de atendimento e vendas.",
    version: "2.1.3",
    dependencies: ["Messaging Core"],
    enabled: true,
  },
  {
    id: "auth",
    name: "Auth Module",
    description: "Autenticação de usuários, permissões e auditoria.",
    version: "1.4.2",
    dependencies: ["User Service", "Sessions"],
    enabled: true,
  },
];

const patternsSeed: ArchitectPattern[] = [
  {
    id: "cqrs",
    name: "CQRS",
    description: "Separa comandos de escrita de consultas de leitura.",
    enabled: false,
  },
  {
    id: "saga",
    name: "SAGA Pattern",
    description: "Orquestra transações distribuídas com compensações.",
    enabled: false,
  },
  {
    id: "circuit-breaker",
    name: "Circuit Breaker",
    description: "Protege integrações externas contra falhas em cascata.",
    enabled: false,
  },
  {
    id: "event-driven",
    name: "Event-Driven Architecture",
    description: "Modela o sistema orientado a eventos e assinaturas.",
    enabled: false,
  },
];

const ArchitectPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [clients] = useState<Client[]>(() => loadClients());
  const [processes] = useState<Process[]>(() => loadProcesses());

  const [sourceType, setSourceType] = useState<"" | "client" | "process">("");
  const [sourceId, setSourceId] = useState<string>("");

  const [entities, setEntities] = useState<ArchitectEntity[]>([]);
  const [relations, setRelations] = useState<ArchitectRelation[]>([]);
  const [modules, setModules] = useState<ArchitectModule[]>(() => recommendedModulesSeed);
  const [patterns, setPatterns] = useState<ArchitectPattern[]>(() => patternsSeed);

  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null);
  const [isSaveOpen, setIsSaveOpen] = useState(false);

  useEffect(() => {
    document.title = "DromeFlow – Architect";
  }, []);

  const selectedSourceLabel = useMemo(() => {
    if (!sourceType || !sourceId) return "";
    if (sourceType === "client") return clients.find((c) => c.id === sourceId)?.name ?? "";
    return processes.find((p) => p.id === sourceId)?.name ?? "";
  }, [sourceType, sourceId, clients, processes]);

  const processesForClient = useMemo(() => {
    if (sourceType !== "client" || !sourceId) return [] as Process[];
    return processes.filter((p) => p.client_id === sourceId);
  }, [processes, sourceId, sourceType]);

  const handleAddEntity = (name: string) => {
    const index = entities.length;
    const x = 80 + (index % 3) * 180;
    const y = 60 + Math.floor(index / 3) * 140;
    const newEntity: ArchitectEntity = {
      id: crypto.randomUUID(),
      name,
      kind: "Model",
      x,
      y,
      fields: [],
    };
    setEntities((prev) => [...prev, newEntity]);
    setSelectedEntityId(newEntity.id);
  };

  const selectedEntity = entities.find((e) => e.id === selectedEntityId) ?? null;

  const updateSelectedEntity = (updater: (entity: ArchitectEntity) => ArchitectEntity) => {
    if (!selectedEntity) return;
    setEntities((prev) => prev.map((e) => (e.id === selectedEntity.id ? updater(e) : e)));
  };

  const addFieldToSelected = () => {
    if (!selectedEntity) return;
    const newField: ArchitectEntityField = {
      id: crypto.randomUUID(),
      name: "field_" + (selectedEntity.fields.length + 1),
      type: "string",
      required: true,
    };
    updateSelectedEntity((entity) => ({ ...entity, fields: [...entity.fields, newField] }));
  };

  const updateField = (fieldId: string, patch: Partial<ArchitectEntityField>) => {
    if (!selectedEntity) return;
    updateSelectedEntity((entity) => ({
      ...entity,
      fields: entity.fields.map((f) => (f.id === fieldId ? { ...f, ...patch } : f)),
    }));
  };

  const removeField = (fieldId: string) => {
    if (!selectedEntity) return;
    updateSelectedEntity((entity) => ({
      ...entity,
      fields: entity.fields.filter((f) => f.id !== fieldId),
    }));
  };

  const addRelation = () => {
    if (entities.length < 2) return;
    const [source, target] = entities;
    const rel: ArchitectRelation = {
      id: crypto.randomUUID(),
      sourceId: source.id,
      targetId: target.id,
      label: "1:M",
    };
    setRelations((prev) => [...prev, rel]);
  };

  const handleSaveBlueprint = (payload: { name: string; description?: string }) => {
    if (!sourceType || !sourceId) return;
    const today = new Date().toISOString().slice(0, 10);
    const blueprints = loadBlueprints();
    const blueprint = {
      id: crypto.randomUUID(),
      sourceType,
      sourceId,
      sourceName: selectedSourceLabel,
      name: payload.name,
      description: payload.description,
      entities,
      relations,
      modules,
      patterns,
      created_at: today,
    };
    saveBlueprints([blueprint, ...blueprints]);
    setIsSaveOpen(false);
  };

  const canOpenDesigner = sourceType !== "" && sourceId !== "";

  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-gradient-to-br from-background via-[hsl(var(--df-muted-deep))] to-[hsl(var(--df-hero-accent))]">
        <AppSidebar />
        <div className="flex flex-1 flex-col">
          <DashboardHeader email={user?.email ?? ""} />
          <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-4 px-4 pb-10 pt-6">
            {/* Seleção inicial */}
            <section className="df-hero-surface">
              <div className="relative flex flex-col gap-4 px-6 py-6 md:flex-row md:items-end md:justify-between md:px-8 md:py-7">
                <div className="space-y-2 md:space-y-3">
                  <p className="df-badge-soft w-fit">Architect</p>
                  <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                    Estruture o blueprint do sistema.
                  </h1>
                  <p className="max-w-xl text-sm text-muted-foreground md:text-base">
                    Selecione um cliente ou processo mapeado para derivar entidades, módulos e padrões arquiteturais.
                  </p>
                </div>
                <div className="flex flex-col gap-2 md:items-end">
                  <div className="grid gap-2 md:grid-cols-2">
                    <Select
                      value={sourceType}
                      onValueChange={(v) => {
                        setSourceType(v as "client" | "process");
                        setSourceId("");
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Origem (cliente ou processo)" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="client">Cliente</SelectItem>
                        <SelectItem value="process">Processo</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select
                      value={sourceId}
                      onValueChange={setSourceId}
                      disabled={!sourceType}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={sourceType === "client" ? "Selecione o cliente" : "Selecione o processo"} />
                      </SelectTrigger>
                      <SelectContent>
                        {sourceType === "client" &&
                          clients.map((c) => (
                            <SelectItem key={c.id} value={c.id}>
                              {c.name}
                            </SelectItem>
                          ))}
                        {sourceType === "process" &&
                          processes.map((p) => (
                            <SelectItem key={p.id} value={p.id}>
                              {p.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {sourceType === "client" && sourceId && (
                    <p className="text-xs text-muted-foreground">
                      {processesForClient.length} processo(s) mapeado(s) para este cliente.
                    </p>
                  )}
                  <Button
                    className="mt-1"
                    size="sm"
                    disabled={!canOpenDesigner}
                    onClick={() => {
                      if (!canOpenDesigner) return;
                    }}
                  >
                    Estruturar Sistema
                  </Button>
                </div>
              </div>
            </section>

            {canOpenDesigner && (
              <section className="grid gap-4 lg:grid-cols-[1.4fr,2.4fr,1.7fr]">
                {/* Painel esquerdo */}
                <div className="space-y-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold">Entidades sugeridas</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        {suggestedEntities.map((name) => (
                          <div key={name} className="flex items-center justify-between gap-2 text-xs">
                            <span className="text-muted-foreground">{name}</span>
                            <Button size="sm" variant="outline" onClick={() => handleAddEntity(name)}>
                              Adicionar
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="mt-2 space-y-1">
                        <p className="text-[11px] font-medium text-muted-foreground">Nova entidade</p>
                        <Input
                          className="h-8 text-xs"
                          placeholder="Digite e pressione Enter"
                          onKeyDown={(e) => {
                            if (e.key === "Enter") {
                              e.preventDefault();
                              const value = (e.target as HTMLInputElement).value.trim();
                              if (value) {
                                handleAddEntity(value);
                                (e.target as HTMLInputElement).value = "";
                              }
                            }
                          }}
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold">Módulos recomendados</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-1.5">
                      {modules.map((mod) => (
                        <div key={mod.id} className="flex items-center justify-between gap-2 rounded border border-border/40 bg-card/40 px-2.5 py-1.5">
                          <div className="flex items-center gap-2">
                            <Checkbox
                              id={mod.id}
                              checked={mod.enabled}
                              onCheckedChange={(checked) =>
                                setModules((prev) =>
                                  prev.map((m) =>
                                    m.id === mod.id ? { ...m, enabled: Boolean(checked) } : m,
                                  ),
                                )
                              }
                            />
                            <label htmlFor={mod.id} className="text-xs font-medium text-foreground cursor-pointer">
                              {mod.name}
                            </label>
                          </div>
                          <span className="text-[10px] text-muted-foreground">v{mod.version}</span>
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Canvas central */}
                <div className="space-y-4">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                      <CardTitle className="text-sm font-semibold">System Blueprint</CardTitle>
                      <Button size="sm" variant="outline" onClick={addRelation} disabled={entities.length < 2}>
                        Adicionar relacionamento 1:M
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <div className="relative flex h-72 w-full items-center justify-center rounded-md bg-[hsl(var(--background)/0.4)]">
                        <svg className="h-full w-full" viewBox="0 0 640 320">
                          <defs>
                            <marker
                              id="arrow"
                              markerWidth="6"
                              markerHeight="6"
                              refX="5"
                              refY="3"
                              orient="auto"
                            >
                              <path d="M0,0 L0,6 L6,3 z" fill="hsl(var(--muted-foreground))" />
                            </marker>
                          </defs>
                          {relations.map((rel) => {
                            const source = entities.find((e) => e.id === rel.sourceId);
                            const target = entities.find((e) => e.id === rel.targetId);
                            if (!source || !target) return null;
                            const sx = source.x;
                            const sy = source.y;
                            const tx = target.x;
                            const ty = target.y;
                            return (
                              <g key={rel.id}>
                                <line
                                  x1={sx}
                                  y1={sy}
                                  x2={tx}
                                  y2={ty}
                                  stroke="hsl(var(--muted-foreground))"
                                  strokeWidth={1.2}
                                  markerEnd="url(#arrow)"
                                />
                                {rel.label && (
                                  <text
                                    x={(sx + tx) / 2}
                                    y={(sy + ty) / 2 - 4}
                                    className="fill-muted-foreground text-[9px]"
                                  >
                                    {rel.label}
                                  </text>
                                )}
                              </g>
                            );
                          })}

                          {entities.map((entity) => (
                            <g
                              key={entity.id}
                              onClick={() => setSelectedEntityId(entity.id)}
                              className="cursor-pointer"
                            >
                              <rect
                                x={entity.x - 60}
                                y={entity.y - 24}
                                width={120}
                                height={48}
                                rx={6}
                                ry={6}
                                fill={
                                  selectedEntityId === entity.id
                                    ? "hsl(var(--primary)/0.18)"
                                    : "hsl(var(--card))"
                                }
                                stroke={
                                  selectedEntityId === entity.id
                                    ? "hsl(var(--primary))"
                                    : "hsl(var(--border))"
                                }
                                strokeWidth={1.2}
                              />
                              <text
                                x={entity.x}
                                y={entity.y - 4}
                                textAnchor="middle"
                                className="fill-foreground text-[11px] font-semibold"
                              >
                                {entity.name}
                              </text>
                              <text
                                x={entity.x}
                                y={entity.y + 12}
                                textAnchor="middle"
                                className="fill-muted-foreground text-[9px]"
                              >
                                {entity.kind}
                              </text>
                            </g>
                          ))}
                        </svg>
                        {entities.length === 0 && (
                          <p className="absolute text-xs text-muted-foreground">
                            Adicione entidades à esquerda para começar o blueprint.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold">Padrões arquiteturais</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-2 md:grid-cols-2">
                      {patterns.map((pattern) => (
                        <div
                          key={pattern.id}
                          className="flex items-center justify-between gap-2 rounded border border-border/40 bg-card/40 px-2.5 py-2 text-xs"
                        >
                          <p className="font-medium text-foreground">{pattern.name}</p>
                          <Checkbox
                            checked={pattern.enabled}
                            onCheckedChange={(checked) =>
                              setPatterns((prev) =>
                                prev.map((p) =>
                                  p.id === pattern.id ? { ...p, enabled: Boolean(checked) } : p,
                                ),
                              )
                            }
                          />
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                </div>

                {/* Painel direito */}
                <div className="space-y-3">
                  <Card>
                    <CardHeader className="pb-3">
                      <CardTitle className="text-sm font-semibold">Propriedades da entidade</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2.5 text-xs">
                      {!selectedEntity ? (
                        <div className="flex h-32 items-center justify-center text-center">
                          <p className="text-xs text-muted-foreground">Selecione uma entidade</p>
                        </div>
                      ) : (
                        <>
                          <div className="space-y-1.5">
                            <p className="text-[11px] font-medium text-muted-foreground">Nome</p>
                            <Input
                              value={selectedEntity.name}
                              onChange={(e) =>
                                updateSelectedEntity((entity) => ({ ...entity, name: e.target.value }))
                              }
                            />
                          </div>
                          <div className="space-y-1.5">
                            <p className="text-[11px] font-medium text-muted-foreground">Tipo</p>
                            <Select
                              value={selectedEntity.kind}
                              onValueChange={(v) =>
                                updateSelectedEntity((entity) => ({ ...entity, kind: v as any }))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Model">Model</SelectItem>
                                <SelectItem value="Service">Service</SelectItem>
                                <SelectItem value="Database">Database</SelectItem>
                                <SelectItem value="API">API</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <p className="text-[11px] font-medium text-muted-foreground">Campos</p>
                              <Button size="sm" variant="outline" onClick={addFieldToSelected}>
                                + Campo
                              </Button>
                            </div>
                            {selectedEntity.fields.length === 0 ? (
                              <p className="text-[11px] text-muted-foreground">
                                Nenhum campo definido ainda.
                              </p>
                            ) : (
                              <div className="space-y-2">
                                {selectedEntity.fields.map((field) => (
                                  <div
                                    key={field.id}
                                    className="grid grid-cols-[1.1fr,0.9fr,auto] items-center gap-2 rounded-md border border-border/60 bg-card/60 p-2"
                                  >
                                    <Input
                                      value={field.name}
                                      onChange={(e) =>
                                        updateField(field.id, { name: e.target.value })
                                      }
                                      placeholder="nome"
                                    />
                                    <Input
                                      value={field.type}
                                      onChange={(e) =>
                                        updateField(field.id, { type: e.target.value })
                                      }
                                      placeholder="tipo"
                                    />
                                    <div className="flex items-center gap-2">
                                      <Checkbox
                                        checked={field.required}
                                        onCheckedChange={(checked) =>
                                          updateField(field.id, { required: Boolean(checked) })
                                        }
                                      />
                                      <Button
                                        type="button"
                                        size="icon"
                                        variant="outline"
                                        className="h-7 w-7"
                                        onClick={() => removeField(field.id)}
                                      >
                                        ×
                                      </Button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-semibold">Blueprint</CardTitle>
                      <Button size="sm" onClick={() => setIsSaveOpen(true)} disabled={entities.length === 0}>
                        Salvar
                      </Button>
                    </CardHeader>
                    <CardContent className="grid grid-cols-2 gap-2 text-xs">
                      <div className="rounded bg-muted/30 px-2 py-1.5">
                        <p className="text-[10px] text-muted-foreground">Entidades</p>
                        <p className="font-semibold text-foreground">{entities.length}</p>
                      </div>
                      <div className="rounded bg-muted/30 px-2 py-1.5">
                        <p className="text-[10px] text-muted-foreground">Relações</p>
                        <p className="font-semibold text-foreground">{relations.length}</p>
                      </div>
                      <div className="rounded bg-muted/30 px-2 py-1.5">
                        <p className="text-[10px] text-muted-foreground">Módulos</p>
                        <p className="font-semibold text-foreground">{modules.filter((m) => m.enabled).length}</p>
                      </div>
                      <div className="rounded bg-muted/30 px-2 py-1.5">
                        <p className="text-[10px] text-muted-foreground">Padrões</p>
                        <p className="font-semibold text-foreground">{patterns.filter((p) => p.enabled).length}</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </section>
            )}
          </main>
        </div>
      </div>

      <BlueprintSaveDialog
        open={isSaveOpen}
        onOpenChange={setIsSaveOpen}
        onSave={handleSaveBlueprint}
      />
    </SidebarProvider>
  );
};

export default ArchitectPage;

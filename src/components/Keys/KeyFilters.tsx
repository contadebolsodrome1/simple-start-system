import type { Tag, Tool } from "@/types/Secret";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface ClientOption {
  id: string;
  name: string;
}

interface KeyFiltersProps {
  tools: Tool[];
  tags: Tag[];
  clients: ClientOption[];
  filters: {
    tool?: string;
    tags?: string[];
    client_id?: string;
    showExpired?: boolean;
    showInactive?: boolean;
    searchQuery?: string;
  };
  onChange: (next: KeyFiltersProps["filters"]) => void;
}

export const KeyFilters = ({ tools, tags, clients, filters, onChange }: KeyFiltersProps) => {
  const update = (patch: Partial<KeyFiltersProps["filters"]>) => onChange({ ...filters, ...patch });

  const toggleTag = (id: string, checked: boolean) => {
    const current = new Set(filters.tags ?? []);
    if (checked) current.add(id);
    else current.delete(id);
    update({ tags: Array.from(current) });
  };

  return (
    <div className="space-y-3 rounded-xl border bg-card/80 p-3 md:p-4">
      <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Filtros ativos</p>
      <div className="grid gap-3 md:grid-cols-3">
        <div className="space-y-1.5">
          <Label className="text-xs">Ferramenta</Label>
          <Select value={filters.tool ?? "all"} onValueChange={(v) => update({ tool: v === "all" ? undefined : v })}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Todas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas</SelectItem>
              {tools.map((tool) => (
                <SelectItem key={tool.id} value={tool.id}>
                  {tool.icon} {tool.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Cliente</Label>
          <Select value={filters.client_id ?? "all"} onValueChange={(v) => update({ client_id: v === "all" ? undefined : v })}>
            <SelectTrigger className="h-8 text-xs">
              <SelectValue placeholder="Todos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              {clients.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label className="text-xs">Tags</Label>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <label key={tag.id} className="inline-flex items-center gap-1.5 rounded-full bg-[hsl(var(--muted))] px-2 py-0.5 text-[11px]">
                <Checkbox
                  checked={(filters.tags ?? []).includes(tag.id)}
                  onCheckedChange={(checked) => toggleTag(tag.id, Boolean(checked))}
                  className="h-3.5 w-3.5"
                />
                <span>{tag.name}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
      <div className="flex flex-wrap gap-4 pt-1 text-[11px] text-muted-foreground">
        <label className="inline-flex items-center gap-1.5">
          <Checkbox
            checked={filters.showExpired ?? false}
            onCheckedChange={(checked) => update({ showExpired: Boolean(checked) })}
            className="h-3.5 w-3.5"
          />
          <span>Mostrar expiradas</span>
        </label>
        <label className="inline-flex items-center gap-1.5">
          <Checkbox
            checked={filters.showInactive ?? false}
            onCheckedChange={(checked) => update({ showInactive: Boolean(checked) })}
            className="h-3.5 w-3.5"
          />
          <span>Mostrar inativas/revogadas</span>
        </label>
        <label className="inline-flex items-center gap-1.5">
          <Checkbox
            checked={filters.showExpired ?? false}
            onCheckedChange={(checked) => update({ showExpired: Boolean(checked) })}
            className="h-3.5 w-3.5"
          />
          <span>Somente criadas nos últimos 7 dias</span>
        </label>
      </div>
    </div>
  );
};

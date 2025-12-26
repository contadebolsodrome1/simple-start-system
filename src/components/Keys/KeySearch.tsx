import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface KeySearchProps {
  query: string;
  onChange: (value: string) => void;
  resultsCount: number;
}

export const KeySearch = ({ query, onChange, resultsCount }: KeySearchProps) => {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
      <div className="relative w-full md:max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Buscar por nome, ferramenta, tag, cliente ou nota..."
          className="pl-9 text-sm"
        />
      </div>
      <p className="text-xs text-muted-foreground md:text-right">{resultsCount} chave(s) encontradas</p>
    </div>
  );
};

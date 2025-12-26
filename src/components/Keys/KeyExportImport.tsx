import { Button } from "@/components/ui/button";
import { Download, Upload } from "lucide-react";

interface KeyExportImportProps {
  onExport: () => void;
  onImport: () => void;
}

export const KeyExportImport = ({ onExport, onImport }: KeyExportImportProps) => {
  return (
    <div className="space-y-3 rounded-xl border bg-card/80 p-3 md:p-4">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">Exportar / Importar</p>
      </div>
      <p className="text-[11px] text-muted-foreground">
        Exportação e importação são simuladas nesta versão. Use apenas dados de desenvolvimento e nunca compartilhe arquivos
        contendo chaves reais.
      </p>
      <div className="flex flex-wrap gap-2">
        <Button size="sm" variant="outline" onClick={onExport}>
          <Download className="mr-1.5 h-3.5 w-3.5" /> Exportar JSON
        </Button>
        <Button size="sm" variant="outline" onClick={onImport}>
          <Upload className="mr-1.5 h-3.5 w-3.5" /> Importar JSON
        </Button>
      </div>
    </div>
  );
};

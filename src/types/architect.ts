import type { Process } from "@/types/process";

export interface ArchitectEntityField {
  id: string;
  name: string;
  type: string;
  required: boolean;
}

export type ArchitectEntityKind = "Model" | "Service" | "Database" | "API";

export interface ArchitectEntity {
  id: string;
  name: string;
  kind: ArchitectEntityKind;
  x: number;
  y: number;
  fields: ArchitectEntityField[];
}

export interface ArchitectRelation {
  id: string;
  sourceId: string;
  targetId: string;
  label?: string;
}

export interface ArchitectModule {
  id: string;
  name: string;
  description: string;
  version: string;
  dependencies: string[];
  enabled: boolean;
}

export interface ArchitectPattern {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
}

export interface Blueprint {
  id: string;
  sourceType: "client" | "process";
  sourceId: string;
  sourceName: string;
  name: string;
  description?: string;
  entities: ArchitectEntity[];
  relations: ArchitectRelation[];
  modules: ArchitectModule[];
  patterns: ArchitectPattern[];
  created_at: string; // YYYY-MM-DD
}

export type BlueprintWithProcess = Blueprint & { process?: Process };

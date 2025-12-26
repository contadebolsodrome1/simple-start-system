export type ProcessCategory = "sales" | "support" | "operations" | "custom";

export type ProcessComplexity = "LOW" | "MEDIUM" | "HIGH";

export interface ProcessStep {
  id: string;
  order: number;
  title: string;
  description?: string;
  actor?: string;
  duration_minutes?: number;
  input_data?: string;
  output_data?: string;
}

export interface ProcessAnalysis {
  total_steps: number;
  complexity: ProcessComplexity;
  automation_potential: ProcessComplexity;
  estimated_savings_percent: number;
}

export interface Process {
  id: string;
  client_id: string;
  client_name: string;
  name: string;
  description?: string;
  category: ProcessCategory;
  steps: ProcessStep[];
  analysis: ProcessAnalysis;
  created_at: string; // YYYY-MM-DD
}

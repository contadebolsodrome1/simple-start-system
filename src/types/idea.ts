export type IdeaPhase = "conception" | "validation" | "structuring" | "implementation";

export type IdeaCategory = "sales" | "operations" | "support" | "custom";

export interface Idea {
  id: string;
  title: string;
  description?: string;
  current_phase: IdeaPhase;
  category: IdeaCategory;
  tags: string[];
  created_at: string; // YYYY-MM-DD
  updated_at: string; // YYYY-MM-DD
}

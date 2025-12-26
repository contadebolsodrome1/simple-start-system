import { supabase } from "@/integrations/supabase/client";
import type { Idea, IdeaPhase } from "@/types/idea";

export async function loadIdeas(tenantId: string): Promise<Idea[]> {
  const { data, error } = await supabase
    .from("ideas")
    .select("*")
    .eq("tenant_id", tenantId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error loading ideas:", error);
    return [];
  }

  return (data || []).map((row) => ({
    id: row.id,
    title: row.title,
    description: row.description || undefined,
    current_phase: row.current_phase as IdeaPhase,
    category: row.category as Idea["category"],
    tags: [], // tags stored separately in idea_tags table if needed
    created_at: new Date(row.created_at).toISOString().slice(0, 10),
    updated_at: new Date(row.updated_at).toISOString().slice(0, 10),
  }));
}

export async function saveIdea(
  tenantId: string,
  userId: string,
  payload: Omit<Idea, "id" | "created_at" | "updated_at"> & { id?: string }
): Promise<Idea | null> {
  const { id, ...rest } = payload;

  if (id) {
    // Update existing
    const { data, error } = await supabase
      .from("ideas")
      .update({
        title: rest.title,
        description: rest.description || null,
        current_phase: rest.current_phase,
        category: rest.category,
      })
      .eq("id", id)
      .eq("tenant_id", tenantId)
      .select()
      .single();

    if (error) {
      console.error("Error updating idea:", error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      current_phase: data.current_phase as IdeaPhase,
      category: data.category as Idea["category"],
      tags: rest.tags,
      created_at: new Date(data.created_at).toISOString().slice(0, 10),
      updated_at: new Date(data.updated_at).toISOString().slice(0, 10),
    };
  } else {
    // Create new
    const { data, error } = await supabase
      .from("ideas")
      .insert({
        tenant_id: tenantId,
        created_by: userId,
        title: rest.title,
        description: rest.description || null,
        current_phase: rest.current_phase,
        category: rest.category,
        status: "active",
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating idea:", error);
      return null;
    }

    return {
      id: data.id,
      title: data.title,
      description: data.description || undefined,
      current_phase: data.current_phase as IdeaPhase,
      category: data.category as Idea["category"],
      tags: rest.tags,
      created_at: new Date(data.created_at).toISOString().slice(0, 10),
      updated_at: new Date(data.updated_at).toISOString().slice(0, 10),
    };
  }
}

export async function deleteIdea(tenantId: string, ideaId: string): Promise<boolean> {
  const { error } = await supabase
    .from("ideas")
    .delete()
    .eq("id", ideaId)
    .eq("tenant_id", tenantId);

  if (error) {
    console.error("Error deleting idea:", error);
    return false;
  }

  return true;
}

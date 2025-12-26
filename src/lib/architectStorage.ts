import type { Blueprint } from "@/types/architect";

const STORAGE_KEY = "architect_blueprints";

interface BlueprintStore {
  blueprints: Blueprint[];
}

export function loadBlueprints(): Blueprint[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as BlueprintStore | Blueprint[];
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray((parsed as BlueprintStore).blueprints)) return (parsed as BlueprintStore).blueprints;
    return [];
  } catch {
    return [];
  }
}

export function saveBlueprints(blueprints: Blueprint[]) {
  if (typeof window === "undefined") return;
  const payload: BlueprintStore = { blueprints };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

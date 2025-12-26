import type { Automation } from "@/types/automation";

const STORAGE_KEY = "automations";

interface AutomationsStore {
  automations: Automation[];
}

export function loadAutomations(): Automation[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as AutomationsStore | Automation[];
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray((parsed as AutomationsStore).automations)) return (parsed as AutomationsStore).automations;
    return [];
  } catch {
    return [];
  }
}

export function saveAutomations(automations: Automation[]) {
  if (typeof window === "undefined") return;
  const payload: AutomationsStore = { automations };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

import type { Process } from "@/types/process";

const STORAGE_KEY = "processes";

interface ProcessesStore {
  processes: Process[];
}

export function loadProcesses(): Process[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as ProcessesStore | Process[];
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray((parsed as ProcessesStore).processes)) return (parsed as ProcessesStore).processes;
    return [];
  } catch {
    return [];
  }
}

export function saveProcesses(processes: Process[]) {
  if (typeof window === "undefined") return;
  const payload: ProcessesStore = { processes };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

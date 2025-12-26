import type { AppUser } from "@/types/user";

const STORAGE_KEY = "users";

interface UsersStore {
  users: AppUser[];
}

export function loadUsers(): AppUser[] {
  if (typeof window === "undefined") return [];
  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as UsersStore | AppUser[];
    if (Array.isArray(parsed)) return parsed;
    if (Array.isArray((parsed as UsersStore).users)) return (parsed as UsersStore).users;
    return [];
  } catch {
    return [];
  }
}

export function saveUsers(users: AppUser[]) {
  if (typeof window === "undefined") return;
  const payload: UsersStore = { users };
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
}

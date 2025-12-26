export type UserRole = "super_admin" | "admin" | "manager" | "analyst" | "viewer";

export interface AppUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  status: "active" | "invited";
  created_at: string; // ISO date string
}

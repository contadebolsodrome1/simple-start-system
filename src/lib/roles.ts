import { supabase } from "@/integrations/supabase/client";
import type { UserRole } from "@/types/user";

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: "Super Admin",
  admin: "Admin",
  manager: "Manager",
  analyst: "Analyst",
  viewer: "Viewer",
};

/**
 * Busca todas as roles de um usuário do banco de dados
 * NUNCA use localStorage para roles - isso é uma vulnerabilidade de segurança!
 */
export async function getUserRoles(userId: string): Promise<UserRole[]> {
  try {
    const { data, error } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", userId);

    if (error) {
      console.error("Error fetching user roles:", error);
      return [];
    }

    return (data?.map((r) => r.role as UserRole) || []);
  } catch (err) {
    console.error("Unexpected error fetching user roles:", err);
    return [];
  }
}

/**
 * Verifica se um usuário tem uma role específica
 */
export async function hasRole(userId: string, role: UserRole): Promise<boolean> {
  const roles = await getUserRoles(userId);
  return roles.includes(role);
}

/**
 * Obtém a role de maior privilégio de um usuário
 * Hierarquia: super_admin > admin > manager > analyst > viewer
 */
export function getHighestRole(roles: UserRole[]): UserRole {
  if (roles.includes("super_admin")) return "super_admin";
  if (roles.includes("admin")) return "admin";
  if (roles.includes("manager")) return "manager";
  if (roles.includes("analyst")) return "analyst";
  if (roles.includes("viewer")) return "viewer";
  return "viewer"; // Default
}

export const Permissions = {
  canViewDashboard(role: UserRole) {
    return true;
  },
  canCrudIdeas(role: UserRole) {
    return role === "super_admin" || role === "admin" || role === "manager";
  },
  canViewIdeas(role: UserRole) {
    return role !== "viewer";
  },
  canCrudClients(role: UserRole) {
    return role === "super_admin" || role === "admin" || role === "manager";
  },
  canViewClients(role: UserRole) {
    return role !== "viewer";
  },
  canCrudProcesses(role: UserRole) {
    return role === "super_admin" || role === "admin" || role === "manager";
  },
  canViewProcesses(role: UserRole) {
    return role !== "viewer";
  },
  canCrudArchitect(role: UserRole) {
    return role === "super_admin" || role === "admin" || role === "manager";
  },
  canViewArchitect(role: UserRole) {
    return role !== "viewer";
  },
  canManageAutomations(role: UserRole) {
    return role === "super_admin" || role === "admin" || role === "manager";
  },
  canViewAutomations(role: UserRole) {
    return role === "super_admin" || role === "admin" || role === "manager";
  },
  canManageUsers(role: UserRole) {
    return role === "super_admin" || role === "admin";
  },
  canManageSecrets(role: UserRole) {
    return role === "super_admin" || role === "admin" || role === "manager";
  },
  canViewSecrets(role: UserRole) {
    return role === "super_admin" || role === "admin" || role === "manager" || role === "analyst";
  },
};

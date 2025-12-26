import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";
import { getUserRoles, getHighestRole } from "@/lib/roles";
import type { UserRole } from "@/types/user";

interface AuthContextValue {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  tenantId: string | null;
  userRole: UserRole | null;
  userRoles: UserRole[];
  signUp: (email: string, password: string) => Promise<{ error: any }>;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch tenant and roles after login
        if (session?.user) {
          // Use setTimeout to defer the async calls
          setTimeout(() => {
            fetchOrCreateTenant(session.user.id, session.user.email);
            loadUserRoles(session.user.id);
          }, 0);
        } else {
          setTenantId(null);
          setUserRole(null);
          setUserRoles([]);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchOrCreateTenant(session.user.id, session.user.email);
        loadUserRoles(session.user.id);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserRoles = async (userId: string) => {
    try {
      const roles = await getUserRoles(userId);
      setUserRoles(roles);
      const highest = getHighestRole(roles);
      setUserRole(highest);
    } catch (err) {
      console.error("Error loading user roles:", err);
      setUserRoles([]);
      setUserRole(null);
    }
  };

  const fetchOrCreateTenant = async (userId: string, userEmail?: string, retryCount = 0) => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 1000; // 1 segundo
    
    try {
      console.log(`[AuthContext] Fetching/creating tenant for user ${userId} (attempt ${retryCount + 1})`);
      
      // Aguardar um pouco para garantir que o JWT esteja válido
      if (retryCount === 0) {
        await new Promise(resolve => setTimeout(resolve, 500));
      }
      
      // Check if user already has tenant membership
      const { data: membership, error: memberError } = await supabase
        .from("tenant_members")
        .select("tenant_id")
        .eq("user_id", userId)
        .maybeSingle();

      if (memberError) {
        console.error(`[AuthContext] Error fetching tenant membership:`, memberError);
        throw memberError;
      }

      if (membership?.tenant_id) {
        console.log(`[AuthContext] Tenant found: ${membership.tenant_id}`);
        setTenantId(membership.tenant_id);
        return;
      }

      console.log(`[AuthContext] No tenant found, creating new tenant...`);
      
      // No tenant found, create one
      const { data: newTenant, error: tenantError } = await supabase
        .from("tenants")
        .insert({
          name: `Tenant ${userId.slice(0, 8)}`,
          slug: `tenant-${userId.slice(0, 8)}`,
        })
        .select("id")
        .single();

      if (tenantError) {
        console.error(`[AuthContext] Error creating tenant:`, tenantError);
        throw tenantError;
      }

      console.log(`[AuthContext] Tenant created: ${newTenant.id}`);

      // Add user to tenant_members
      const { error: memberInsertError } = await supabase
        .from("tenant_members")
        .insert({
          tenant_id: newTenant.id,
          user_id: userId,
          email: userEmail ?? user?.email ?? "",
          role: "admin",
        });

      if (memberInsertError) {
        console.error(`[AuthContext] Error creating tenant membership:`, memberInsertError);
        throw memberInsertError;
      }

      console.log(`[AuthContext] Tenant membership created successfully`);
      setTenantId(newTenant.id);
    } catch (err: any) {
      console.error(`[AuthContext] Error in fetchOrCreateTenant (attempt ${retryCount + 1}):`, err);
      
      // Retry logic
      if (retryCount < MAX_RETRIES) {
        console.log(`[AuthContext] Retrying in ${RETRY_DELAY}ms...`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY));
        return fetchOrCreateTenant(userId, userEmail, retryCount + 1);
      }
      
      console.error(`[AuthContext] Failed after ${MAX_RETRIES} attempts`);
    }
  };

  const signUp = async (email: string, password: string) => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl
      }
    });
    
    return { error };
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setTenantId(null);
    setUserRole(null);
    setUserRoles([]);
  };

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Carregando...</div>;
  }

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        session, 
        isAuthenticated: !!user, 
        tenantId,
        userRole,
        userRoles,
        signUp,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
};

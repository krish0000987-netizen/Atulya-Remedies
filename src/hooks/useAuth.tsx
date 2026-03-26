import { useState, useEffect, createContext, useContext, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User, Session } from "@supabase/supabase-js";

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const adminCacheRef = useRef<Record<string, boolean>>({});

  const checkAdmin = useCallback(async (userId: string) => {
    // Use cached result if already checked
    if (adminCacheRef.current[userId] !== undefined) {
      setIsAdmin(adminCacheRef.current[userId]);
      return;
    }
    try {
      const { data } = await supabase.rpc("has_role", {
        _user_id: userId,
        _role: "admin",
      });
      const result = !!data;
      adminCacheRef.current[userId] = result;
      setIsAdmin(result);
    } catch (err) {
      console.error("Failed to check admin role:", err);
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    // Set up the auth state change listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        // CRITICAL: Set loading=true while we check the admin role
        // This prevents AdminLayout from redirecting before the check completes
        if (session?.user) {
          setLoading(true);
        }
        setSession(session);
        setUser(session?.user ?? null);
        if (session?.user) {
          await checkAdmin(session.user.id);
        } else {
          setIsAdmin(false);
        }
        setLoading(false);
      }
    );

    // CRITICAL SAFETY TIMEOUT:
    // If Supabase takes too long to initialize (e.g. network/env issues),
    // force stop the loading state after 5 seconds so the app doesn't stay stuck.
    const timeoutId = setTimeout(() => {
      setLoading(false);
      console.warn("Auth initialization timed out. Proceeding anyway.");
    }, 5000);

    // Then get the initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      clearTimeout(timeoutId);
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        await checkAdmin(session.user.id);
      }
      setLoading(false);
    }).catch(err => {
      clearTimeout(timeoutId);
      console.error("Session check error:", err);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      clearTimeout(timeoutId);
    };
  }, [checkAdmin]);

  const signIn = useCallback(async (email: string, password: string) => {
    // Set loading true BEFORE starting sign in
    // so AdminLayout shows spinner until checkAdmin finishes
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      setLoading(false);
    }
    // If no error, loading will be set to false by onAuthStateChange after checkAdmin
    return { error: error as Error | null };
  }, []);

  const signOut = useCallback(async () => {
    adminCacheRef.current = {};
    await supabase.auth.signOut();
    setIsAdmin(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, session, isAdmin, loading, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

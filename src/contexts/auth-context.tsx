'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import type { User, Session } from '@supabase/supabase-js';

interface AuthUser {
  id: string;
  email: string;
  fullName: string | null;
  phone: string | null;
  avatarUrl: string | null;
  role: string;
  emailVerified: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function mapSupabaseUser(user: User): AuthUser {
  return {
    id: user.id,
    email: user.email!,
    fullName: user.user_metadata?.full_name || null,
    phone: user.user_metadata?.phone || null,
    avatarUrl: user.user_metadata?.avatar_url || null,
    role: user.user_metadata?.role || 'patient',
    emailVerified: !!user.email_confirmed_at,
  };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  const refreshUser = useCallback(async () => {
    try {
      const getUserPromise = supabase.auth.getUser();
      const timeoutPromise = new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('Refresh timeout')), 8000)
      );
      const { data: { user: supabaseUser }, error } = await Promise.race([
        getUserPromise,
        timeoutPromise,
      ]);
      
      if (error || !supabaseUser) {
        setUser(null);
        setSession(null);
        return;
      }

      setUser(mapSupabaseUser(supabaseUser));
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession);
    } catch {
      setUser(null);
      setSession(null);
    }
  }, [supabase.auth]);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Timeout after 8s - Supabase may be unreachable (e.g. blocked in India)
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Auth timeout')), 8000)
        );
        const { data: { session: initialSession } } = await Promise.race([
          sessionPromise,
          timeoutPromise,
        ]);
        
        if (initialSession?.user) {
          setUser(mapSupabaseUser(initialSession.user));
          setSession(initialSession);
        }
      } catch (error) {
        // Supabase unreachable (ERR_NAME_NOT_RESOLVED, timeout, etc.) - treat as logged out
        setUser(null);
        setSession(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (currentSession?.user) {
          setUser(mapSupabaseUser(currentSession.user));
          setSession(currentSession);
        } else {
          setUser(null);
          setSession(null);
        }

        // Handle specific auth events
        if (event === 'SIGNED_OUT') {
          router.push('/login');
          router.refresh();
        }

        if (event === 'PASSWORD_RECOVERY') {
          router.push('/reset-password');
        }

        if (event === 'USER_UPDATED') {
          router.refresh();
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase.auth, router]);

  const signOut = useCallback(async () => {
    setUser(null);
    setSession(null);
    try {
      await supabase.auth.signOut();
    } catch {
      // Supabase unreachable - already cleared local state
    }
    router.push('/login');
    router.refresh();
  }, [supabase.auth, router]);

  const value: AuthContextType = {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    signOut,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}

// Hook for requiring authentication
export function useRequireAuth(redirectTo: string = '/login') {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  return { user, isLoading };
}

// Hook for guest-only pages (login, register)
export function useRequireGuest(redirectTo: string = '/dashboard') {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && user) {
      router.push(redirectTo);
    }
  }, [user, isLoading, router, redirectTo]);

  return { user, isLoading };
}

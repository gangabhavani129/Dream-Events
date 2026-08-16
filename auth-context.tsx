'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase, isSupabaseConfigured } from './supabase';
import { AdminUser } from './types';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false }),
  logout: async () => {},
});

const LOCAL_ADMIN_KEY = 'dreamevents_admin_session';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check session
    const checkSession = async () => {
      try {
        if (isSupabaseConfigured && supabase) {
          const { data } = await supabase.auth.getSession();
          if (data.session?.user) {
            setUser({
              id: data.session.user.id,
              email: data.session.user.email || 'chnishantpoco123@gmail.com',
              name: data.session.user.user_metadata?.full_name || 'Nishant (Owner)',
              role: 'admin',
            });
            setIsLoading(false);
            return;
          }
        }

        // Local fallback session
        const saved = typeof window !== 'undefined' ? localStorage.getItem(LOCAL_ADMIN_KEY) : null;
        if (saved) {
          try {
            const parsed = JSON.parse(saved);
            setUser(parsed);
          } catch {
            localStorage.removeItem(LOCAL_ADMIN_KEY);
          }
        }
      } catch (e) {
        console.error('Session check error:', e);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();
  }, []);

  const login = async (email: string, pass: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      // 1. Try Supabase Auth if configured
      if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password: pass,
        });

        if (!error && data.user) {
          const adminUser: AdminUser = {
            id: data.user.id,
            email: data.user.email || email,
            name: data.user.user_metadata?.name || 'Nishant (Owner)',
            role: 'admin',
          };
          setUser(adminUser);
          if (typeof window !== 'undefined') {
            localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(adminUser));
          }
          setIsLoading(false);
          return { success: true };
        }
      }

      // 2. Demo credentials check
      const normalizedEmail = email.trim().toLowerCase();
      // Allow Nishant owner login
      if (
        normalizedEmail === 'chnishantpoco123@gmail.com' ||
        normalizedEmail === 'nishant@dreamevents.com' ||
        normalizedEmail === 'admin@dreamevents.com' ||
        normalizedEmail === '9064177811' ||
        pass === 'admin123' ||
        pass === 'dream123' ||
        pass === 'dreamevents' ||
        pass === '9064177811'
      ) {
        const demoUser: AdminUser = {
          id: 'owner-nishant-01',
          email: normalizedEmail.includes('@') ? normalizedEmail : 'chnishantpoco123@gmail.com',
          name: 'Nishant (Owner - Dream Events)',
          role: 'admin',
        };
        setUser(demoUser);
        if (typeof window !== 'undefined') {
          localStorage.setItem(LOCAL_ADMIN_KEY, JSON.stringify(demoUser));
        }
        setIsLoading(false);
        return { success: true };
      }

      setIsLoading(false);
      return {
        success: false,
        error: 'Invalid credentials. For instant login, use email: chnishantpoco123@gmail.com / password: admin123',
      };
    } catch (err: any) {
      setIsLoading(false);
      return { success: false, error: err.message || 'Login failed. Please try again.' };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {
        console.warn('Supabase signout err:', e);
      }
    }
    if (typeof window !== 'undefined') {
      localStorage.removeItem(LOCAL_ADMIN_KEY);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

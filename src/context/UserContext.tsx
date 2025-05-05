import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { supabase } from '../supabaseClient';
import { Session, AuthChangeEvent } from '@supabase/supabase-js';

interface UserProfile {
  id: string;
  email: string;
  nombre: string;
  rol: 'alumno' | 'profesor' | 'admin';
  avatar_url?: string;
  especialidad?: string;
  nivel_educativo?: string;
  puntos_acumulados?: number;
}

interface UserContextType {
  user: UserProfile | null;
  loading: boolean;
  error: string | null;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  error: null,
  signOut: async () => {},
  refreshUser: async () => {}
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setState] = useState<{
    user: UserProfile | null;
    loading: boolean;
    error: string | null;
  }>({
    user: null,
    loading: true,
    error: null
  });

  const fetchUserProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    try {
      const response = await fetch('http://localhost:3001/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('supabase_token')}`
        }
      });

      if (!response.ok) throw new Error('Error al obtener perfil');
      return await response.json();
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }
  }, []);

  const handleAuthChange = useCallback(async (event: AuthChangeEvent, session: Session | null) => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      if (!session) {
        setState({ user: null, loading: false, error: null });
        localStorage.removeItem('supabase_token');
        return;
      }

      localStorage.setItem('supabase_token', session.access_token);
      const userProfile = await fetchUserProfile(session.user.id);
      setState({ user: userProfile, loading: false, error: null });

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error desconocido',
        loading: false
      }));
    }
  }, [fetchUserProfile]);

  const refreshUser = useCallback(async () => {
    if (!state.user?.id) return;
    setState(prev => ({ ...prev, loading: true }));
    try {
      const updatedProfile = await fetchUserProfile(state.user.id);
      setState(prev => ({ ...prev, user: updatedProfile, loading: false }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al actualizar',
        loading: false
      }));
    }
  }, [state.user?.id, fetchUserProfile]);

  const signOut = async () => {
    setState(prev => ({ ...prev, loading: true }));
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setState({ user: null, loading: false, error: null });
      localStorage.removeItem('supabase_token');
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Error al cerrar sesión',
        loading: false
      }));
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) handleAuthChange('SIGNED_IN', session);
      else setState(prev => ({ ...prev, loading: false }));
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthChange);
    return () => subscription.unsubscribe();
  }, [handleAuthChange]);

  return (
    <UserContext.Provider value={{
      user: state.user,
      loading: state.loading,
      error: state.error,
      signOut,
      refreshUser
    }}>
      {children}
    </UserContext.Provider>
  );
};
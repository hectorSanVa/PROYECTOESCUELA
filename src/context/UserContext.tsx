import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

interface UserContextType {
  user: any;
  loading: boolean;
  role: string | null;
  error: string | null;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  role: null,
  error: null,
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para determinar el rol basado en el correo
  const getRoleFromEmail = (email: string | null) => {
    return email?.endsWith('@unach.mx') ? 'profesor' : 'alumno';
  };

  useEffect(() => {
    console.log('UserProvider useEffect triggered');
    const getSession = async () => {
      setLoading(true);
      console.log('token', localStorage.getItem('supabase_token'));
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error || !session) {
          // Solo limpia si realmente hay un cambio (evita bucles)
          if (user !== null || role !== null || error !== null) {
            setUser(null);
            setRole(null);
            setError(error?.message || null);
            localStorage.removeItem('supabase_token');
          }
          setLoading(false);
          return;
        }
  
        // Solo actualiza si hay cambios
        if (session.user?.id !== user?.id || session.access_token !== localStorage.getItem('supabase_token')) {
          setUser(session.user);
          setRole(getRoleFromEmail(session.user.email ?? null));
          localStorage.setItem('supabase_token', session.access_token);
        }
      } finally {
        setLoading(false);
      }
    };
  
    getSession();
  
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' && session) {
        localStorage.setItem('supabase_token', session.access_token);
        getSession();
      }
      if (event === 'SIGNED_OUT') {
        localStorage.removeItem('supabase_token');
        getSession();
      }
    });
  
    return () => subscription.unsubscribe();
  }, [user, role, error]); // Añade dependencias para evitar bucles

  return (
    <UserContext.Provider value={{ user, loading, role, error }}>
      {children}
    </UserContext.Provider>
  );
}; 
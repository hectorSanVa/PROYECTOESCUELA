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
    return email?.endsWith('@unach.mx') ? 'docente' : 'alumno';
  };

  useEffect(() => {
    const getSession = async () => {
      setLoading(true);
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        setUser(null);
        setRole(null);
        setError('No autenticado');
        setLoading(false);
        return;
      }
      if (data?.user) {
        setUser(data.user);
        setRole(getRoleFromEmail(data.user.email ?? null));
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    };
    getSession();
    // Suscribirse a cambios de sesión
    const { data: listener } = supabase.auth.onAuthStateChange(() => {
      getSession();
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, role, error }}>
      {children}
    </UserContext.Provider>
  );
}; 
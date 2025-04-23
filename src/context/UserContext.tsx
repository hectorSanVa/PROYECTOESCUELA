import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase/config';
import { User } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface UserContextType {
  user: User | null;
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
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Función para determinar el rol basado en el correo
  const getRoleFromEmail = (email: string | null) => {
    return email?.endsWith('@unach.mx') ? 'docente' : 'alumno';
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      try {
        if (!user) {
          setUser(null);
          setRole(null);
          setLoading(false);
          return;
        }

        setUser(user);
        // Asignar rol inmediatamente basado en el correo
        const initialRole = getRoleFromEmail(user.email);
        setRole(initialRole);
        setLoading(false);

        // Verificar/actualizar rol en Firestore en segundo plano
        try {
          const userRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userRef);

          if (!userDoc.exists()) {
            await setDoc(userRef, {
              email: user.email,
              displayName: user.displayName,
              role: initialRole,
              createdAt: new Date(),
            });
          } else {
            const userData = userDoc.data();
            // Solo actualizar el rol si es diferente
            if (userData.role !== initialRole) {
              setRole(userData.role);
            }
          }
        } catch (firestoreError) {
          console.error('Error con Firestore:', firestoreError);
          // No mostrar error al usuario ya que tenemos un rol asignado
        }
      } catch (err) {
        console.error('Error en autenticación:', err);
        setError('Error al verificar la sesión');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, role, error }}>
      {children}
    </UserContext.Provider>
  );
}; 
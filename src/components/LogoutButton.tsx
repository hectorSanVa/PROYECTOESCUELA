import React from 'react';
import { supabase } from '../supabaseClient';
import './LogoutButton.css';

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // Redirige a la página de login después de cerrar sesión
      window.location.href = '/login';
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <button className="logout-button" onClick={handleLogout}>
      <span className="logout-icon">⬅️</span>
      Cerrar Sesión
    </button>
  );
};

export default LogoutButton;
import React from 'react';
import { auth } from '../firebase/config';
import { signOut } from 'firebase/auth';
import './LogoutButton.css';

const LogoutButton: React.FC = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);
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
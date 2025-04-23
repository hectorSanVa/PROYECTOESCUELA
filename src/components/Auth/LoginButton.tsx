import React from 'react';
import { auth } from '../../firebase/config';
import { GoogleAuthProvider, signInWithPopup, signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import './LoginButton.css';

const LoginButton: React.FC = () => {
  const [user] = useAuthState(auth);
  
  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="auth-container">
      {user ? (
        <div className="user-info">
          <img src={user.photoURL || ''} alt="Foto de perfil" className="profile-photo" />
          <div className="user-details">
            <span className="user-name">{user.displayName}</span>
            <button onClick={handleSignOut} className="logout-button">
              Cerrar Sesión
            </button>
          </div>
        </div>
      ) : (
        <button onClick={signInWithGoogle} className="login-button">
          <img src="/google-icon.svg" alt="Google" className="google-icon" />
          Iniciar con Google
        </button>
      )}
    </div>
  );
};

export default LoginButton; 
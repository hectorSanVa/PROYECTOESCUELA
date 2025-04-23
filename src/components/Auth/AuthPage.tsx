import React, { useState } from 'react';
import { auth } from '../../firebase/config';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import './AuthPage.css';

const AuthPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: 'select_account'
      });

      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Error de autenticación:', error);
      if (error instanceof Error) {
        if (error.message.includes('popup-closed-by-user')) {
          setError('Se cerró la ventana de inicio de sesión');
        } else if (error.message.includes('network')) {
          setError('Error de conexión. Verifica tu internet');
        } else if (error.message.includes('unauthorized-domain')) {
          setError('Este dominio no está autorizado para iniciar sesión');
        } else {
          setError('Error al iniciar sesión. Intenta de nuevo');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-content">
          <div className="auth-header">
            <img src="/logo.png" alt="EduBot" className="auth-logo" />
            <h1>EduBot</h1>
          </div>
          
          <div className="auth-welcome">
            <h2>¡Bienvenido a tu plataforma educativa!</h2>
            <p>Aprende matemáticas y español de forma interactiva y personalizada</p>
          </div>

          <div className="auth-options">
            <button 
              onClick={signInWithGoogle} 
              className={`google-button ${loading ? 'loading' : ''}`}
              disabled={loading}
            >
              {loading ? (
                <div className="button-loader"></div>
              ) : (
                <>
                  <img src="/google-icon.svg" alt="Google" className="google-icon" />
                  Continuar con Google
                </>
              )}
            </button>
            {error && <p className="auth-error">{error}</p>}
          </div>

          <div className="auth-features">
            <h3>Lo que encontrarás:</h3>
            <div className="features-grid">
              <div className="feature-item">
                <span className="feature-icon">📚</span>
                <p>Ejercicios interactivos</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🎯</span>
                <p>Aprendizaje personalizado</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">📊</span>
                <p>Seguimiento de progreso</p>
              </div>
              <div className="feature-item">
                <span className="feature-icon">🏆</span>
                <p>Logros y recompensas</p>
              </div>
            </div>
          </div>

          <div className="auth-info">
            <p className="auth-note">
              Profesores: Usar correo institucional @unach.mx
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage; 
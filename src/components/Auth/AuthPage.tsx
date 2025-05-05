import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import './AuthPage.css';

const AuthPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signInWithGoogle = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin
        }
      });
      
      if (error) throw error;
    } catch (error) {
      setError('Error al iniciar sesión con Google');
      console.error(error);
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
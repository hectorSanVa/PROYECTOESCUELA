import React, { useState } from 'react';
import { supabase } from '../../supabaseClient';
import './RegisterForm.css';

interface LoginFormProps {
  onClose: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!formData.email || !formData.password) {
      setError('Por favor, completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      });
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('Correo o contraseña incorrectos');
        } else if (error.message.includes('Email not confirmed')) {
          setError('Debes confirmar tu correo antes de iniciar sesión');
        } else {
          setError(error.message || 'Error al iniciar sesión');
        }
        return;
      }
      onClose();
    } catch (err: any) {
      setError('Error inesperado al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const signInWithGoogle = async () => {
    setLoading(true);
    setError('');
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (error) {
      setError('Error al iniciar sesión con Google');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form-overlay">
      <div className="register-form-container">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Iniciar sesión</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="ejemplo@correo.com"
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Ingresa tu contraseña"
            />
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
        <div className="divider">o</div>
        <button onClick={signInWithGoogle} className="google-button" disabled={loading}>
          <img src="/google-icon.svg" alt="Google" className="google-icon" />
          Iniciar con Google
        </button>
      </div>
    </div>
  );
};

export default LoginForm; 
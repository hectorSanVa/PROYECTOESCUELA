import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import './RegisterForm.css';

interface RegisterFormProps {
  onClose: () => void;
}
const RegisterForm: React.FC<RegisterFormProps> = ({ onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'alumno',
    nivel_educativo: '',
    especialidad: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Cierra sesión automáticamente al entrar al formulario
    supabase.auth.signOut();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword || !formData.fullName) {
      setError('Por favor, completa todos los campos');
      return false;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    if (formData.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!validateForm()) return;

    try {
      setLoading(true);
      
      // Registrar usuario en Supabase
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            role: formData.role
          }
        }
      });

      if (error) throw error;

      // Insertar datos adicionales en la tabla de usuarios
      if (data.user) {
        const { error: profileError } = await supabase
          .from('usuarios')
          .insert({
            id: data.user.id,
            email: formData.email,
            rol: formData.role,
            nombre: formData.fullName,
            nivel_educativo: formData.role === 'alumno' ? formData.nivel_educativo : null,
            especialidad: formData.role === 'profesor' ? formData.especialidad : null,
          });

        if (profileError) throw profileError;

        // Lógica para crear en alumnos o profesores
        if (formData.role === 'alumno') {
          await supabase.from('alumnos').insert({
            id: data.user.id,
            nombre: formData.fullName,
            nivel_educativo: formData.nivel_educativo,
            puntos_acumulados: 0
          });
        }
        if (formData.role === 'profesor') {
          await supabase.from('profesores').insert({
            id: data.user.id,
            nombre: formData.fullName,
            especialidad: formData.especialidad
          });
        }
      }
      onClose();
    } catch (error) {
      if (typeof error === 'object' && error !== null && 'code' in error) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          setError('Este correo ya está registrado');
          break;
        case 'auth/invalid-email':
          setError('Correo electrónico inválido');
          break;
        default:
          setError('Error al crear la cuenta');
      }
      }      
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-form-overlay">
      <div className="register-form-container">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Crear cuenta nueva</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="fullName">Nombre completo</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Ingresa tu nombre completo"
            />
          </div>

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
            <label htmlFor="role">Tipo de usuario</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="alumno">Alumno</option>
              <option value="profesor">Profesor</option>
            </select>
          </div>

          {formData.role === 'alumno' && (
            <div className="form-group">
              <label htmlFor="nivel_educativo">Nivel educativo</label>
              <select
                id="nivel_educativo"
                name="nivel_educativo"
                value={formData.nivel_educativo}
                onChange={handleChange}
              >
                <option value="">Selecciona nivel educativo</option>
                <option value="secundaria_1">Secundaria 1</option>
                <option value="secundaria_2">Secundaria 2</option>
                <option value="secundaria_3">Secundaria 3</option>
              </select>
            </div>
          )}

          {formData.role === 'profesor' && (
            <div className="form-group">
              <label htmlFor="especialidad">Especialidad</label>
              <select
                id="especialidad"
                name="especialidad"
                value={formData.especialidad}
                onChange={handleChange}
              >
                <option value="">Selecciona especialidad</option>
                <option value="español">Español</option>
                <option value="matematicas">Matemáticas</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="password">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmar contraseña</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Repite tu contraseña"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="submit-button"
            disabled={loading}
          >
            {loading ? 'Creando cuenta...' : 'Crear cuenta'}
          </button>
        </form>

        {formData.role === 'docente' && (
          <div className="info-message">
            Nota: Para registrarte como docente, debes usar un correo @edu.com
          </div>
        )}
      </div>
    </div>
  );
};

export default RegisterForm; 
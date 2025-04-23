import React from 'react';
import { useUser } from '../context/UserContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase/config';
import './StudentDashboard.css';

const StudentDashboard: React.FC = () => {
  const { user } = useUser();

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="dashboard">
      <div className="user-info">
        <div className="user-email">
          Correo: {user?.email}
        </div>
        <div className="user-role">
          Estudiante
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-section">
          <h2>Mis Cursos</h2>
          <div className="dashboard-actions">
            <button className="action-button primary">Ver cursos disponibles</button>
            <button className="action-button">Continuar aprendizaje</button>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Tareas y Ejercicios</h2>
          <div className="task-list">
            <div className="task-item new">
              <div className="task-status">Nuevo</div>
              <h3>Ejercicios de Álgebra</h3>
              <p>Fecha límite: 15 de Mayo</p>
              <button className="action-button">Ver tarea</button>
            </div>
            <div className="task-item feedback">
              <div className="task-status">Retroalimentación</div>
              <h3>Geometría Básica</h3>
              <p>Calificado por EduBot</p>
              <button className="action-button">Ver resultados</button>
            </div>
          </div>
          <div className="dashboard-actions">
            <button className="action-button">Ver todas las tareas</button>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Mi Progreso</h2>
          <div className="progress-summary">
            <div className="progress-item">
              <div className="progress-label">Tareas Completadas</div>
              <div className="progress-bar">
                <div className="progress-fill" style={{width: '75%'}}></div>
              </div>
              <div className="progress-text">15/20</div>
            </div>
            <div className="progress-item">
              <div className="progress-label">Promedio General</div>
              <div className="progress-value">8.5</div>
            </div>
          </div>
          <div className="dashboard-actions">
            <button className="action-button">Ver calificaciones</button>
            <button className="action-button">Estadísticas de aprendizaje</button>
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Resultados EduBot</h2>
          <div className="bot-results">
            <div className="result-item">
              <svg className="result-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <div className="result-content">
                <h3>Último análisis</h3>
                <p>Ejercicios de Geometría - 90% de precisión</p>
              </div>
              <button className="action-button small">Ver detalles</button>
            </div>
            <div className="result-history">
              <h3>Historial de análisis</h3>
              <div className="history-list">
                <div className="history-item">
                  <span>Álgebra Básica</span>
                  <span>85%</span>
                </div>
                <div className="history-item">
                  <span>Trigonometría</span>
                  <span>78%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="logout-container">
        <button onClick={handleLogout} className="logout-button">
          <svg className="logout-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
          </svg>
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default StudentDashboard; 
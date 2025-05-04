import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { getCursos } from '../../services/cursos';
import { getActividades } from '../../services/actividades';
import './StudentDashboard.css';
import { supabase } from '../../supabaseClient';

const StudentDashboard: React.FC = () => {
  const { user } = useUser();
  const [cursos, setCursos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [actividades, setActividades] = useState<any[]>([]);
  const [loadingActividades, setLoadingActividades] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarCursos();
    cargarActividades();
  }, []);

  const cargarCursos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCursos();
      setCursos(res.data);
    } catch (e) {
      setCursos([]);
      setError('No se pudieron cargar los cursos');
    }
    setLoading(false);
  };

  const cargarActividades = async () => {
    setLoadingActividades(true);
    try {
      const res = await getActividades();
      setActividades(res.data);
    } catch (e) {
      setActividades([]);
    }
    setLoadingActividades(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
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
            {loading ? (
              <div>Cargando cursos...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <ul>
                {cursos.map((curso: any) => (
                  <li key={curso.id} className="curso-item">
                    {curso.nombre}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <h2>Tareas y Ejercicios</h2>
          <div className="task-list">
            {loadingActividades ? (
              <div>Cargando tareas...</div>
            ) : actividades.length === 0 ? (
              <div>No hay tareas disponibles.</div>
            ) : (
              actividades.map((actividad: any) => (
                <div className="task-item" key={actividad.id}>
                  <h3>{actividad.nombre}</h3>
                  <p>{actividad.descripcion}</p>
                  <button className="action-button">Ver tarea</button>
                </div>
              ))
            )}
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
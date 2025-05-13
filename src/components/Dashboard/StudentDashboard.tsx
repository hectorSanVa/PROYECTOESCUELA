import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { getCursos } from '../../services/cursos';
import { getActividades } from '../../services/actividades';
import './StudentDashboard.css';
import { supabase } from '../../supabaseClient';

const mockAlumno = {
  nombre: 'Sofía Ramírez',
  avatar: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png',
  nivel: 'Secundaria 2',
  puntos: 320,
  progreso: 68,
  ranking: 3,
};

const mockCursos = [
  { id: 1, nombre: 'Matemáticas', icono: '🧮', progreso: 80, color: '#a084e8' },
  { id: 2, nombre: 'Geometría', icono: '📐', progreso: 60, color: '#3edfa0' },
  { id: 3, nombre: 'Álgebra', icono: '➗', progreso: 45, color: '#ffb347' },
];

const mockActividades = [
  { id: 1, tipo: 'Quiz', nombre: 'Quiz de fracciones', puntos: 10, estado: 'pendiente', color: '#6c63ff' },
  { id: 2, tipo: 'Juego', nombre: 'Juego de palabras', puntos: 15, estado: 'completada', color: '#3edfa0' },
  { id: 3, tipo: 'Problema', nombre: 'Problema matemático', puntos: 20, estado: 'pendiente', color: '#ff6b81' },
];

const mockRecompensas = [
  { id: 1, tipo: 'medalla', nombre: 'Medalla de oro', icono: '🥇' },
  { id: 2, tipo: 'insignia', nombre: 'Insignia lógica', icono: '🧠' },
  { id: 3, tipo: 'puntos_extra', nombre: 'Puntos extra', icono: '🎁' },
];

const mockRespuestasIA = [
  { id: 1, pregunta: '¿Qué es una fracción?', respuesta: 'Una fracción representa una parte de un todo.', fecha: '2024-05-10' },
  { id: 2, pregunta: '¿Cómo resuelvo ecuaciones?', respuesta: 'Despeja la incógnita paso a paso.', fecha: '2024-05-12' },
];

const mockRanking = [
  { id: 1, nombre: 'Carlos', puntos: 400, avatar: 'https://cdn-icons-png.flaticon.com/512/2922/2922506.png' },
  { id: 2, nombre: 'Sofía Ramírez', puntos: 320, avatar: 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png' },
  { id: 3, nombre: 'Ana', puntos: 290, avatar: 'https://cdn-icons-png.flaticon.com/512/2922/2922512.png' },
];

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
    <div className="student-dashboard-bg">
      <div className="student-header">
        <img src={mockAlumno.avatar} alt="Avatar" className="student-avatar" />
        <div className="student-info">
          <h1>¡Hola, {mockAlumno.nombre}!</h1>
          <div className="student-nivel">{mockAlumno.nivel}</div>
          <div className="student-puntos">⭐ {mockAlumno.puntos} puntos</div>
          <div className="student-progreso-bar">
            <div className="student-progreso-fill" style={{ width: `${mockAlumno.progreso}%` }}></div>
          </div>
          <div className="student-progreso-label">Progreso general: {mockAlumno.progreso}%</div>
        </div>
      </div>

      {/* Actividades y Retos fuera del grid */}
      <div className="student-actividades-section">
        <h2>Actividades y Retos</h2>
        <div className="student-actividades-list">
          {mockActividades.map(act => (
            <div className={`actividad-card ${act.estado}`} key={act.id} style={{ borderColor: act.color }}>
              <div className="actividad-tipo">{act.tipo}</div>
              <div className="actividad-nombre">{act.nombre}</div>
              <div className="actividad-puntos">Puntos: <b>{act.puntos}</b></div>
              <div className={`actividad-estado ${act.estado}`}>{act.estado === 'pendiente' ? 'Pendiente' : 'Completada'}</div>
              <button className="actividad-btn">{act.estado === 'pendiente' ? 'Resolver' : 'Ver resultado'}</button>
            </div>
          ))}
        </div>
      </div>

      <div className="student-sections-grid">
        {/* Mis Cursos */}
        <div className="student-section">
          <h2>Mis Cursos</h2>
          <div className="student-cursos-list">
            {mockCursos.map(curso => (
              <div className="student-curso-card" key={curso.id} style={{ background: curso.color }}>
                <span className="curso-icono">{curso.icono}</span>
                <div className="curso-nombre">{curso.nombre}</div>
                <div className="curso-progreso-bar">
                  <div className="curso-progreso-fill" style={{ width: `${curso.progreso}%` }}></div>
                </div>
                <div className="curso-progreso-label">{curso.progreso}%</div>
                <button className="curso-btn">Entrar</button>
              </div>
            ))}
          </div>
        </div>

        {/* Recompensas */}
        <div className="student-section">
          <h2>Mis Recompensas</h2>
          <div className="student-recompensas-list">
            {mockRecompensas.map(r => (
              <div className="recompensa-card" key={r.id}>
                <span className="recompensa-icono">{r.icono}</span>
                <div className="recompensa-nombre">{r.nombre}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Progreso y Estadísticas */}
        <div className="student-section">
          <h2>Mi Progreso</h2>
          <div className="student-progreso-stats">
            <div className="progreso-item">
              <span className="progreso-label">Tareas Completadas</span>
              <span className="progreso-valor">15/20</span>
            </div>
            <div className="progreso-item">
              <span className="progreso-label">Promedio General</span>
              <span className="progreso-valor">8.5</span>
            </div>
          </div>
        </div>

        {/* Respuestas IA */}
        <div className="student-section">
          <h2>Respuestas EduBot</h2>
          <div className="student-ia-list">
            {mockRespuestasIA.map(r => (
              <div className="ia-card" key={r.id}>
                <div className="ia-pregunta">❓ <b>{r.pregunta}</b></div>
                <div className="ia-respuesta">💡 {r.respuesta}</div>
                <div className="ia-fecha">{r.fecha}</div>
              </div>
            ))}
            <button className="ia-btn">Preguntar a EduBot</button>
          </div>
        </div>

        {/* Ranking */}
        <div className="student-section">
          <h2>Ranking de la Clase</h2>
          <div className="student-ranking-list">
            {mockRanking.map((r, idx) => (
              <div className={`ranking-card ${idx === 0 ? 'top' : ''}`} key={r.id}>
                <img src={r.avatar} alt={r.nombre} className="ranking-avatar" />
                <div className="ranking-nombre">{r.nombre}</div>
                <div className="ranking-puntos">{r.puntos} pts</div>
                <div className="ranking-posicion">#{idx + 1}</div>
              </div>
            ))}
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
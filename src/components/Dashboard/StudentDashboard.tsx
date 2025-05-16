import React, { useEffect, useState } from 'react';
import { useUser } from '../../context/UserContext';
import { getCursos } from '../../api/cursos';
import { getActividades } from '../../api/actividades';
import './StudentDashboard.css';
import { supabase } from '../../supabaseClient';
import { getAlumnoById, getAlumnos } from '../../services/alumnos';
import { getProgresos } from '../../services/progreso';
import { getRecompensasByAlumno } from '../../services/recompensas';
import { getRespuestasIA } from '../../services/ia';

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

interface Curso {
  id: number;
  nombre: string;
  descripcion?: string | null;
  profesor_id: string | null;
  materia: 'español' | 'matematicas' | null;
  icono_url?: string | null;
}

const tipoIcono = (tipo: string) => {
  switch (tipo) {
    case 'medalla': return '🥇';
    case 'insignia': return '🧠';
    case 'puntos_extra': return '🎁';
    default: return '🏅';
  }
};

const cargarRanking = async (setRanking: React.Dispatch<React.SetStateAction<any[]>>) => {
  try {
    const res = await getAlumnos();
    let alumnos = Array.isArray(res.data) ? res.data : [];
    alumnos = alumnos
      .filter((a: any) => typeof a.puntos_acumulados === 'number')
      .sort((a: any, b: any) => b.puntos_acumulados - a.puntos_acumulados)
      .slice(0, 10);
    setRanking(alumnos);
  } catch (e: any) {
    setRanking([]);
  }
};

const StudentDashboard: React.FC = () => {
  const { user } = useUser();
  const [alumno, setAlumno] = useState<any>(null);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [loading, setLoading] = useState(false);
  const [actividades, setActividades] = useState<any[]>([]);
  const [loadingActividades, setLoadingActividades] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [modalActividad, setModalActividad] = useState<any | null>(null);
  const [respuesta, setRespuesta] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [progresoAlumno, setProgresoAlumno] = useState<number>(0);
  const [recompensas, setRecompensas] = useState<any[]>([]);
  const [loadingRecompensas, setLoadingRecompensas] = useState(false);
  const [errorRecompensas, setErrorRecompensas] = useState<string | null>(null);
  const [ranking, setRanking] = useState<any[]>([]);
  const [loadingRanking, setLoadingRanking] = useState(false);
  const [errorRanking, setErrorRanking] = useState<string | null>(null);
  const [progresos, setProgresos] = useState<any[]>([]);
  const [loadingProgresos, setLoadingProgresos] = useState(false);
  const [errorProgresos, setErrorProgresos] = useState<string | null>(null);
  const [respuestasIA, setRespuestasIA] = useState<any[]>([]);
  const [loadingIA, setLoadingIA] = useState(false);
  const [errorIA, setErrorIA] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      console.log('ID del usuario autenticado:', user.id);
      cargarAlumno(user.id);
      cargarProgreso(user.id);
      cargarRecompensas(user.id);
      cargarRanking(setRanking);
      cargarProgresos(user.id);
      cargarRespuestasIA(user.id);
    }
    cargarCursos();
    cargarActividades();
  }, [user]);

  const cargarAlumno = async (id: string) => {
    try {
      const res = await getAlumnoById(id);
      setAlumno(res.data);
    } catch (e) {
      setAlumno(null);
    }
  };

  const cargarCursos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getCursos();
      console.log('Respuesta de cursos (alumno):', res.data);
      const cursosData = Array.isArray(res.data) ? res.data : [];
      setCursos(cursosData);
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
      console.log('Respuesta de actividades:', res.data);
      setActividades(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      setActividades([]);
    }
    setLoadingActividades(false);
  };

  const cargarProgreso = async (alumnoId: string) => {
    try {
      const res = await getProgresos();
      // Filtrar solo los progresos de este alumno
      const progresos = Array.isArray(res.data) ? res.data.filter((p: any) => p.alumno_id === alumnoId) : [];
      // Calcular porcentaje de progreso
      const completadas = progresos.filter((p: any) => p.completado).length;
      const total = progresos.length;
      const porcentaje = total > 0 ? Math.round((completadas / total) * 100) : 0;
      setProgresoAlumno(porcentaje);
    } catch (e) {
      setProgresoAlumno(0);
    }
  };

  const cargarRecompensas = async (alumnoId: string) => {
    setLoadingRecompensas(true);
    setErrorRecompensas(null);
    try {
      const res = await getRecompensasByAlumno(alumnoId);
      setRecompensas(Array.isArray(res.data) ? res.data : []);
    } catch (e: any) {
      setRecompensas([]);
      setErrorRecompensas(e.message || 'No se pudieron cargar las recompensas');
    }
    setLoadingRecompensas(false);
  };

  const cargarProgresos = async (alumnoId: string) => {
    setLoadingProgresos(true);
    setErrorProgresos(null);
    try {
      const res = await getProgresos();
      const datos = Array.isArray(res.data) ? res.data.filter((p: any) => p.alumno_id === alumnoId) : [];
      setProgresos(datos);
    } catch (e: any) {
      setProgresos([]);
      setErrorProgresos(e.message || 'No se pudo cargar el progreso');
    }
    setLoadingProgresos(false);
  };

  const cargarRespuestasIA = async (alumnoId: string) => {
    setLoadingIA(true);
    setErrorIA(null);
    try {
      const res = await getRespuestasIA(); // Si tienes un método por alumno, úsalo aquí
      const datos = Array.isArray(res.data) ? res.data.filter((r: any) => r.alumno_id === alumnoId) : [];
      setRespuestasIA(datos);
    } catch (e: any) {
      setRespuestasIA([]);
      setErrorIA(e.message || 'No se pudieron cargar las respuestas IA');
    }
    setLoadingIA(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };

  const handleAbrirModal = (actividad: any) => {
    setModalActividad(actividad);
    setRespuesta('');
    setFeedback(null);
  };

  const handleCerrarModal = () => {
    setModalActividad(null);
    setRespuesta('');
    setFeedback(null);
  };

  const handleEnviarRespuesta = async () => {
    if (!user?.id || !modalActividad?.id) return;
    setEnviando(true);
    setFeedback(null);
    try {
      const token = localStorage.getItem('supabase_token');
      const payload = {
        alumno_id: user.id,
        actividad_id: modalActividad.id,
        completado: true,
        respuesta,
      };
      console.log('Payload enviado a /api/progreso:', payload);
      const res = await fetch('http://localhost:3001/api/progreso', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      let resJson = null;
      let resText = '';
      try {
        resJson = await res.json();
      } catch {
        try {
          resText = await res.text();
        } catch {}
      }
      console.log('Respuesta de /api/progreso:', res.status, resJson || resText);
      if (!res.ok) {
        // Mostrar el mensaje real del backend, sea string, objeto o texto plano
        let errorMsg = resJson?.error || resJson?.message || resText || 'Error al registrar el progreso';
        if (typeof errorMsg === 'object') errorMsg = JSON.stringify(errorMsg);
        throw new Error(errorMsg);
      }
      setFeedback('¡Respuesta enviada y actividad completada! 🎉');
      setTimeout(() => {
        handleCerrarModal();
        cargarActividades();
      }, 1500);
    } catch (e: any) {
      setFeedback(e.message || JSON.stringify(e) || 'Error al enviar la respuesta');
    }
    setEnviando(false);
  };

  return (
    <div className="student-dashboard-bg">
      <div className="student-header">
        <img src={alumno?.usuario?.avatar_url || 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png'} alt="Avatar" className="student-avatar" />
        <div className="student-info">
          <h1>¡Hola, {alumno?.nombre || 'Alumno'}!</h1>
          <div className="student-nivel">{alumno?.nivel_educativo || '-'}</div>
          <div className="student-puntos">⭐ {alumno?.puntos_acumulados ?? 0} puntos</div>
          <div className="student-progreso-bar">
            <div className="student-progreso-fill" style={{ width: `${progresoAlumno}%` }}></div>
          </div>
          <div className="student-progreso-label">Progreso general: {progresoAlumno}%</div>
        </div>
      </div>

      {/* Actividades y Retos fuera del grid */}
      <div className="student-actividades-section">
        <h2>Actividades y Retos</h2>
        <div className="student-actividades-list">
          {loadingActividades ? (
            <div>Cargando actividades...</div>
          ) : actividades.length === 0 ? (
            <div>No hay actividades disponibles</div>
          ) : (
            actividades.map((act: any) => (
              <div className={`actividad-card ${act.estado || ''}`} key={act.id} style={{ borderColor: act.color || '#a084e8' }}>
                <div className="actividad-tipo">{act.tipo || 'Actividad'}</div>
                <div className="actividad-nombre">{act.nombre || act.pregunta}</div>
                <div className="actividad-puntos">Puntos: <b>{act.puntos ?? act.puntos_recompensa ?? '-'}</b></div>
                <div className={`actividad-estado ${act.estado}`}>{act.estado === 'pendiente' ? 'Pendiente' : 'Completada'}</div>
                <button className="actividad-btn" onClick={() => handleAbrirModal(act)}>
                  Resolver
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal de actividad */}
      {modalActividad && (
        <div className="modal-bg" onClick={e => { if (e.target === e.currentTarget) handleCerrarModal(); }}>
          <div className="modal-actividad-rediseñada" tabIndex={-1} onKeyDown={e => { if (e.key === 'Escape') handleCerrarModal(); }}>
            <button className="modal-close-rediseñada" onClick={handleCerrarModal} title="Cerrar">×</button>
            <h2 className="modal-title-rediseñada">{modalActividad.nombre || modalActividad.pregunta}</h2>
            <div className="modal-pregunta-rediseñada">{modalActividad.pregunta}</div>
            {/* Opciones tipo quiz o juego_palabras */}
            {Array.isArray(modalActividad.opciones) && modalActividad.opciones.length > 0 ? (
              <div className="modal-opciones-rediseñada">
                {modalActividad.opciones.map((op: string, idx: number) => (
                  <label key={idx} className="modal-opcion-rediseñada">
                    <input
                      type="radio"
                      name="opcion"
                      value={op}
                      checked={respuesta === op}
                      onChange={() => setRespuesta(op)}
                      disabled={enviando}
                    />
                    {op}
                  </label>
                ))}
              </div>
            ) : (
              <input
                className="modal-input-rediseñada"
                type="text"
                placeholder="Escribe tu respuesta..."
                value={respuesta}
                onChange={e => setRespuesta(e.target.value)}
                disabled={enviando}
                autoFocus
              />
            )}
            <button
              className="modal-enviar-rediseñada"
              onClick={handleEnviarRespuesta}
              disabled={enviando || !respuesta}
            >
              {enviando ? 'Enviando...' : 'Enviar respuesta'}
            </button>
            {feedback && <div className={`modal-feedback-rediseñada ${feedback.includes('completada') ? 'success' : 'error'}`}>{feedback}</div>}
          </div>
        </div>
      )}

      <div className="student-sections-grid">
        {/* Mis Cursos */}
        <div className="student-section">
          <h2>Mis Cursos</h2>
          <div className="student-cursos-list">
            {loading ? (
              <div>Cargando cursos...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : cursos.length === 0 ? (
              <div>No hay cursos disponibles</div>
            ) : (
              cursos.map((curso) => (
                <div className="student-curso-card" key={curso.id} style={{ background: '#a084e8' }}>
                  <span className="curso-icono">📘</span>
                  <div className="curso-nombre">{curso.nombre}</div>
                  <button className="curso-btn">Entrar</button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Recompensas */}
        <div className="student-section">
          <h2>Mis Recompensas</h2>
          <div className="student-recompensas-list">
            {loadingRecompensas ? (
              <div>Cargando recompensas...</div>
            ) : errorRecompensas ? (
              <div className="error-message">{errorRecompensas}</div>
            ) : recompensas.length === 0 ? (
              <div>No tienes recompensas aún</div>
            ) : (
              recompensas.map(r => (
                <div className="recompensa-card" key={r.id}>
                  <span className="recompensa-icono">{tipoIcono(r.tipo)}</span>
                  <div className="recompensa-nombre">{r.tipo.charAt(0).toUpperCase() + r.tipo.slice(1)}</div>
                  {r.descripcion && <div className="recompensa-desc">{r.descripcion}</div>}
                </div>
              ))
            )}
          </div>
        </div>

        {/* Progreso y Estadísticas */}
        <div className="student-section">
          <h2>Mi Progreso</h2>
          <div className="student-progreso-stats">
            {loadingProgresos ? (
              <div>Cargando progreso...</div>
            ) : errorProgresos ? (
              <div className="error-message">{errorProgresos}</div>
            ) : (
              <>
                <div className="progreso-item">
                  <span className="progreso-label">Tareas Completadas</span>
                  <span className="progreso-valor">{progresos.filter(p => p.completado).length}/{progresos.length}</span>
                </div>
                <div className="progreso-item">
                  <span className="progreso-label">Promedio General</span>
                  <span className="progreso-valor">{
                    progresos.length > 0
                      ? (
                        Math.round(
                          (progresos.filter(p => p.completado).length / progresos.length) * 10
                        )
                      ) : 0
                  } / 10</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Ranking */}
        <div className="student-section">
          <h2>Ranking de la Clase</h2>
          <div className="student-ranking-list">
            {loadingRanking ? (
              <div>Cargando ranking...</div>
            ) : errorRanking ? (
              <div className="error-message">{errorRanking}</div>
            ) : ranking.length === 0 ? (
              <div>No hay ranking disponible</div>
            ) : (
              ranking.map((r, idx) => (
                <div className={`ranking-card ${idx === 0 ? 'top' : ''}`} key={r.id}>
                  <img src={r.usuario?.avatar_url || 'https://cdn-icons-png.flaticon.com/512/2922/2922510.png'} alt={r.nombre} className="ranking-avatar" />
                  <div className="ranking-nombre">{r.nombre}</div>
                  <div className="ranking-puntos">{r.puntos_acumulados} pts</div>
                  <div className="ranking-posicion">#{idx + 1}</div>
                </div>
              ))
            )}
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
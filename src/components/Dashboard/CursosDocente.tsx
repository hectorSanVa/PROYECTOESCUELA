import React, { useEffect, useState } from 'react';
import { getCursos, createCurso, deleteCurso } from '../../api/cursos';
import './TeacherDashboard.css';

interface Curso {
  id: number;
  nombre: string;
  descripcion?: string | null;
  profesor_id: string | null;
  materia: 'español' | 'matematicas' | null;
  icono_url?: string | null;
  lecciones?: any[];
}

const CursosDocente: React.FC = () => {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [nuevoCurso, setNuevoCurso] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargarCursos = async () => {
      try {
        setLoading(true);
        const response = await getCursos();
        if (response && Array.isArray(response.data)) {
          setCursos(response.data);
        } else {
          setCursos([]);
        }
      } catch (err) {
        setError('Error al cargar los cursos');
        setCursos([]);
      } finally {
        setLoading(false);
      }
    };
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await getCursos();
      console.log('Respuesta de cursos:', res.data);
      setCursos(res.data);
    } catch (e) {
      setCursos([]);
      setError('No se pudieron cargar los cursos');
    }
    setLoading(false);
  };

  const handleCrearCurso = async () => {
    if (nuevoCurso.trim() === '') {
      setError('El nombre del curso no puede estar vacío');
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      await createCurso({ nombre: nuevoCurso, descripcion });
      setNuevoCurso('');
      setDescripcion('');
      setSuccess('Curso creado exitosamente');
      cargarCursos();
    } catch (e) {
      setError((e as any).message || 'No se pudo crear el curso');
    }
    setLoading(false);
  };

  const handleEliminarCurso = async (id: string) => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await deleteCurso(id);
      if (res && (res.success || res.data || res.message === 'Curso eliminado')) {
        setSuccess('Curso eliminado exitosamente');
        setTimeout(() => {
          cargarCursos();
        }, 1200);
      } else {
        setError(res?.error || 'No se pudo eliminar el curso');
      }
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message || 'No se pudo eliminar el curso');
      } else {
        setError('No se pudo eliminar el curso');
      }
    }
    setLoading(false);
  };

  return (
    <div className="cursosdocente-panel">
      <h2 className="cursosdocente-title">Mis Cursos</h2>
      <div className="cursosdocente-form">
        <input
          value={nuevoCurso}
          onChange={e => setNuevoCurso(e.target.value)}
          placeholder="Nombre del curso"
          className="input-curso"
          disabled={loading}
        />
        <input
          value={descripcion}
          onChange={e => setDescripcion(e.target.value)}
          placeholder="Descripción del curso"
          className="input-curso"
          disabled={loading}
        />
        <button className="action-button primary" onClick={handleCrearCurso} disabled={loading}>
          + Crear nuevo curso
        </button>
      </div>
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="cursosdocente-grid">
        {loading ? (
          <div className="loading">Cargando cursos...</div>
        ) : cursos.length === 0 ? (
          <div className="no-cursos">No tienes cursos registrados.</div>
        ) : (
          cursos.map((curso) => (
            <div key={curso.id} className="curso-card-docente">
              <div className="curso-card-header">
                <div className="curso-card-title">{curso.nombre}</div>
                <span className="curso-card-badge">{curso.lecciones?.length || 0} lecciones</span>
              </div>
              <div className="curso-card-desc">{curso.descripcion || 'Sin descripción'}</div>
              <div className="curso-card-footer">
                <button className="action-button edit" disabled={loading}>
                  Editar
                </button>
                <button className="action-button delete" onClick={() => handleEliminarCurso(curso.id.toString())} disabled={loading}>
                  Eliminar
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CursosDocente; 
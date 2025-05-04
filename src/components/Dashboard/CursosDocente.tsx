import React, { useEffect, useState } from 'react';
import { getCursos, createCurso, deleteCurso } from '../../api/cursos';
import './TeacherDashboard.css';

const CursosDocente: React.FC = () => {
  const [cursos, setCursos] = useState<any[]>([]);
  const [nuevoCurso, setNuevoCurso] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarCursos();
  }, []);

  const cargarCursos = async () => {
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await getCursos();
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
      await deleteCurso(id);
      setSuccess('Curso eliminado');
      cargarCursos();
    } catch (e) {
      setError('No se pudo eliminar el curso');
    }
    setLoading(false);
  };

  return (
    <div>
      <h2>Mis Cursos</h2>
      <div className="dashboard-actions">
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
          Crear nuevo curso
        </button>
      </div>
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
      <div className="cursos-list">
        {loading ? (
          <div>Cargando cursos...</div>
        ) : (
          <ul>
            {cursos.map((curso: any) => (
              <li key={curso.id} className="curso-item">
                {curso.nombre}
                <button className="action-button delete" onClick={() => handleEliminarCurso(curso.id)} disabled={loading}>
                  Eliminar
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CursosDocente; 
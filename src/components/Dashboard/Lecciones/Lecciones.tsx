import React, { useEffect, useState } from 'react';
import { getLecciones, createLeccion, deleteLeccion, updateLeccion } from '../../../api/lecciones';
import { getCursos } from '../../../api/cursos';
import './Lecciones.css';

interface Leccion {
  id: number;
  titulo: string;
  curso_id?: number;
  curso?: { nombre: string };
  fecha_creacion?: string;
  duracion_estimada_min?: number;
  orden: number;
}

interface Curso {
  id: number;
  nombre: string;
}

const Lecciones: React.FC = () => {
  const [lecciones, setLecciones] = useState<Leccion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [cursoId, setCursoId] = useState<number | ''>('');
  const [titulo, setTitulo] = useState('');
  const [orden, setOrden] = useState<number | ''>('');
  const [duracion, setDuracion] = useState<number | ''>('');
  const [success, setSuccess] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitulo, setEditTitulo] = useState('');
  const [editOrden, setEditOrden] = useState<number | ''>('');
  const [editDuracion, setEditDuracion] = useState<number | ''>('');

  useEffect(() => {
    const cargarLecciones = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getLecciones();
        setLecciones(res.data || res || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido');
      }
      setLoading(false);
    };
    const cargarCursos = async () => {
      try {
        const res = await getCursos();
        setCursos(res.data || res || []);
      } catch {}
    };
    cargarLecciones();
    cargarCursos();
  }, []);

  const handleCrearLeccion = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    if (!cursoId || !titulo || !orden) {
      setError('Completa todos los campos');
      return;
    }
    setLoading(true);
    try {
      await createLeccion({ curso_id: Number(cursoId), titulo, orden: Number(orden), duracion_estimada_min: duracion ? Number(duracion) : undefined });
      setSuccess('Lección creada exitosamente');
      setTitulo('');
      setOrden('');
      setCursoId('');
      setDuracion('');
      const res = await getLecciones();
      setLecciones(res.data || res || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    }
    setLoading(false);
  };

  const handleEliminarLeccion = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta lección?')) return;
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await deleteLeccion(id);
      setSuccess('Lección eliminada exitosamente');
      const res = await getLecciones();
      setLecciones(res.data || res || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    }
    setLoading(false);
  };

  const handleEditarLeccion = (leccion: Leccion) => {
    setEditId(leccion.id);
    setEditTitulo(leccion.titulo);
    setEditOrden(leccion.orden);
    setEditDuracion(leccion.duracion_estimada_min ?? '');
  };

  const handleGuardarEdicion = async (id: number) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      await updateLeccion(id, {
        titulo: editTitulo,
        orden: editOrden ? Number(editOrden) : undefined,
        duracion_estimada_min: editDuracion ? Number(editDuracion) : undefined,
      });
      setSuccess('Lección editada exitosamente');
      setEditId(null);
      const res = await getLecciones();
      setLecciones(res.data || res || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    }
    setLoading(false);
  };

  const handleCancelarEdicion = () => {
    setEditId(null);
  };

  return (
    <div className="lecciones-panel">
      <h2 className="lecciones-title">Lecciones</h2>
      <form className="leccion-form" onSubmit={handleCrearLeccion}>
        <select className="leccion-input" value={cursoId} onChange={e => setCursoId(Number(e.target.value))} disabled={loading}>
          <option value="">Selecciona un curso</option>
          {cursos.map(curso => (
            <option key={curso.id} value={curso.id}>{curso.nombre}</option>
          ))}
        </select>
        <input className="leccion-input" type="text" placeholder="Título de la lección" value={titulo} onChange={e => setTitulo(e.target.value)} disabled={loading} />
        <input className="leccion-input" type="number" placeholder="Orden" value={orden} onChange={e => setOrden(Number(e.target.value))} disabled={loading} />
        <input className="leccion-input" type="number" placeholder="Duración (min)" value={duracion} onChange={e => setDuracion(Number(e.target.value))} disabled={loading} />
        <button className="leccion-btn crear" type="submit" disabled={loading}>+ Crear lección</button>
      </form>
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Cargando lecciones...</div>
      ) : lecciones.length === 0 ? (
        <div className="no-lecciones">No hay lecciones registradas.</div>
      ) : (
        <table className="lecciones-table">
          <thead>
            <tr>
              <th>Título</th>
              <th>Curso</th>
              <th>Orden</th>
              <th>Duración (min)</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lecciones.map((leccion) => (
              <tr key={leccion.id}>
                {editId === leccion.id ? (
                  <>
                    <td><input className="leccion-input" value={editTitulo} onChange={e => setEditTitulo(e.target.value)} /></td>
                    <td>{leccion.curso?.nombre || leccion.curso_id || '-'}</td>
                    <td><input className="leccion-input" type="number" value={editOrden} onChange={e => setEditOrden(Number(e.target.value))} /></td>
                    <td><input className="leccion-input" type="number" value={editDuracion} onChange={e => setEditDuracion(Number(e.target.value))} /></td>
                    <td>{leccion.fecha_creacion ? new Date(leccion.fecha_creacion).toLocaleDateString() : '-'}</td>
                    <td>
                      <button className="leccion-btn guardar" onClick={() => handleGuardarEdicion(leccion.id)} disabled={loading}>Guardar</button>
                      <button className="leccion-btn cancelar" onClick={handleCancelarEdicion} disabled={loading}>Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td>{leccion.titulo}</td>
                    <td>{leccion.curso?.nombre || leccion.curso_id || '-'}</td>
                    <td>{leccion.orden}</td>
                    <td>{leccion.duracion_estimada_min ?? '-'}</td>
                    <td>{leccion.fecha_creacion ? new Date(leccion.fecha_creacion).toLocaleDateString() : '-'}</td>
                    <td>
                      <button className="leccion-btn editar" onClick={() => handleEditarLeccion(leccion)} disabled={loading}>Editar</button>
                      <button className="leccion-btn eliminar" onClick={() => handleEliminarLeccion(leccion.id)} disabled={loading}>Eliminar</button>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Lecciones; 
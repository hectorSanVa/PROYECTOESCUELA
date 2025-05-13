import React, { useEffect, useState } from 'react';
import './Recompensas.css';
import { getRecompensas } from '../../../services/recompensas';
import { getAlumnos } from '../../../services/alumnos';
import { createRecompensa, updateRecompensa, deleteRecompensa } from '../../../services/recompensas';

interface RecompensaAlumno {
  id: number;
  alumno: string;
  recompensa: string;
  descripcion: string;
  fecha: string;
  icono: string;
}

const tipoIcono = (tipo: string) => {
  switch (tipo) {
    case 'medalla': return '🏅';
    case 'insignia': return '⭐';
    case 'puntos_extra': return '🎁';
    default: return '🎖️';
  }
};

const Recompensas: React.FC = () => {
  const [recompensas, setRecompensas] = useState<RecompensaAlumno[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [alumnos, setAlumnos] = useState<any[]>([]);
  const [form, setForm] = useState({ alumnoId: '', tipo: 'medalla', descripcion: '' });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSuccess, setFormSuccess] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getRecompensas();
        const datos = (res.data || res || []).map((r: any) => ({
          id: r.id,
          alumno: r.alumno?.nombre || r.alumno_id || '-',
          recompensa: r.tipo.charAt(0).toUpperCase() + r.tipo.slice(1),
          descripcion: r.descripcion || '-',
          fecha: r.created_at ? r.created_at.split('T')[0] : '-',
          icono: tipoIcono(r.tipo),
        }));
        setRecompensas(datos);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al cargar recompensas');
      }
      setLoading(false);
    };
    cargar();
  }, []);

  const abrirModal = async (recompensa?: RecompensaAlumno) => {
    setShowModal(true);
    setFormError(null);
    setFormSuccess(null);
    if (recompensa) {
      setEditId(recompensa.id);
      setForm({
        alumnoId: alumnos.find(a => a.nombre === recompensa.alumno)?.id || '',
        tipo: recompensa.recompensa.toLowerCase(),
        descripcion: recompensa.descripcion
      });
    } else {
      setEditId(null);
      setForm({ alumnoId: '', tipo: 'medalla', descripcion: '' });
    }
    try {
      const res = await getAlumnos();
      setAlumnos(res.data || res || []);
    } catch (e) {
      setFormError('Error al cargar alumnos');
    }
  };

  const cerrarModal = () => {
    setShowModal(false);
    setFormError(null);
    setFormSuccess(null);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSuccess(null);
    if (!form.alumnoId || !form.tipo) {
      setFormError('Selecciona un alumno y tipo de recompensa');
      return;
    }
    setFormLoading(true);
    try {
      if (editId) {
        await updateRecompensa(editId.toString(), { alumno_id: form.alumnoId, tipo: form.tipo, descripcion: form.descripcion });
        setFormSuccess('Recompensa editada exitosamente');
      } else {
        await createRecompensa({ alumno_id: form.alumnoId, tipo: form.tipo, descripcion: form.descripcion });
        setFormSuccess('Recompensa asignada exitosamente');
      }
      setForm({ alumnoId: '', tipo: 'medalla', descripcion: '' });
      setEditId(null);
      // Recargar recompensas
      const res = await getRecompensas();
      const datos = (res.data || res || []).map((r: any) => ({
        id: r.id,
        alumno: r.alumno?.nombre || r.alumno_id || '-',
        recompensa: r.tipo.charAt(0).toUpperCase() + r.tipo.slice(1),
        descripcion: r.descripcion || '-',
        fecha: r.created_at ? r.created_at.split('T')[0] : '-',
        icono: tipoIcono(r.tipo),
      }));
      setRecompensas(datos);
      setTimeout(() => cerrarModal(), 1200);
    } catch (e) {
      setFormError(e instanceof Error ? e.message : 'Error al asignar recompensa');
    }
    setFormLoading(false);
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta recompensa?')) return;
    setLoading(true);
    setError(null);
    try {
      await deleteRecompensa(id.toString());
      const res = await getRecompensas();
      const datos = (res.data || res || []).map((r: any) => ({
        id: r.id,
        alumno: r.alumno?.nombre || r.alumno_id || '-',
        recompensa: r.tipo.charAt(0).toUpperCase() + r.tipo.slice(1),
        descripcion: r.descripcion || '-',
        fecha: r.created_at ? r.created_at.split('T')[0] : '-',
        icono: tipoIcono(r.tipo),
      }));
      setRecompensas(datos);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al eliminar recompensa');
    }
    setLoading(false);
  };

  return (
    <div className="recompensas-panel">
      <h2 className="recompensas-title">Recompensas</h2>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Cargando recompensas...</div>
      ) : (
        <table className="recompensas-table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Recompensa</th>
              <th>Descripción</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {recompensas.map((r) => (
              <tr key={r.id}>
                <td>{r.alumno}</td>
                <td><span className="recompensa-icono">{r.icono}</span> {r.recompensa}</td>
                <td>{r.descripcion}</td>
                <td>{r.fecha}</td>
                <td>
                  <button className="recompensa-btn ver">Ver</button>
                  <button className="recompensa-btn asignar" onClick={() => abrirModal(r)}>Editar</button>
                  <button className="recompensa-btn eliminar" onClick={() => handleEliminar(r.id)}>Eliminar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <button className="nueva-recompensa-btn" onClick={() => abrirModal()}>+ Nueva Recompensa</button>
      {showModal && (
        <div className="modal-bg">
          <div className="modal">
            <h3>{editId ? 'Editar recompensa' : 'Asignar nueva recompensa'}</h3>
            <form className="modal-form" onSubmit={handleFormSubmit}>
              <label>Alumno:
                <select name="alumnoId" value={form.alumnoId} onChange={handleFormChange} disabled={formLoading} required>
                  <option value="">Selecciona un alumno</option>
                  {alumnos.map(a => <option key={a.id} value={a.id}>{a.nombre}</option>)}
                </select>
              </label>
              <label>Tipo:
                <select name="tipo" value={form.tipo} onChange={handleFormChange} disabled={formLoading} required>
                  <option value="medalla">Medalla</option>
                  <option value="insignia">Insignia</option>
                  <option value="puntos_extra">Puntos extra</option>
                </select>
              </label>
              <label>Descripción:
                <input name="descripcion" value={form.descripcion} onChange={handleFormChange} disabled={formLoading} maxLength={80} />
              </label>
              {formError && <div className="error-message">{formError}</div>}
              {formSuccess && <div className="success-message">{formSuccess}</div>}
              <div className="modal-actions">
                <button type="button" onClick={cerrarModal} disabled={formLoading}>Cancelar</button>
                <button type="submit" disabled={formLoading}>Asignar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recompensas; 
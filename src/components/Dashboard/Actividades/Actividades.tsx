import React, { useEffect, useState } from 'react';
import { getActividades, createActividad, updateActividad, deleteActividad } from '../../../api/actividades';
import { getLecciones } from '../../../api/lecciones';
import './Actividades.css';
import { FaEdit, FaTrash, FaQuestionCircle, FaPuzzlePiece, FaKeyboard, FaCalculator } from 'react-icons/fa';

interface Actividad {
  id: number;
  leccion_id?: number;
  tipo: string;
  pregunta: string;
  respuesta_correcta?: string;
  puntos_recompensa: number;
  leccion?: { titulo: string };
}
interface Leccion { id: number; titulo: string; }

const tipos = [
  { value: 'quiz', label: 'Quiz' },
  { value: 'arrastrar_soltar', label: 'Arrastrar y soltar' },
  { value: 'juego_palabras', label: 'Juego de palabras' },
  { value: 'problema_matematico', label: 'Problema matemático' },
];

const tipoIcono = (tipo: string) => {
  switch (tipo) {
    case 'quiz': return <FaQuestionCircle className="actividad-icon quiz" title="Quiz" />;
    case 'arrastrar_soltar': return <FaPuzzlePiece className="actividad-icon arrastrar" title="Arrastrar y soltar" />;
    case 'juego_palabras': return <FaKeyboard className="actividad-icon palabras" title="Juego de palabras" />;
    case 'problema_matematico': return <FaCalculator className="actividad-icon matematico" title="Problema matemático" />;
    default: return <FaQuestionCircle className="actividad-icon" />;
  }
};

const Actividades: React.FC = () => {
  const [actividades, setActividades] = useState<Actividad[]>([]);
  const [lecciones, setLecciones] = useState<Leccion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Formulario crear
  const [leccionId, setLeccionId] = useState<number | ''>('');
  const [tipo, setTipo] = useState('quiz');
  const [pregunta, setPregunta] = useState('');
  const [respuesta, setRespuesta] = useState('');
  const [puntos, setPuntos] = useState<number | ''>('');

  // Edición
  const [editId, setEditId] = useState<number | null>(null);
  const [editLeccionId, setEditLeccionId] = useState<number | ''>('');
  const [editTipo, setEditTipo] = useState('quiz');
  const [editPregunta, setEditPregunta] = useState('');
  const [editRespuesta, setEditRespuesta] = useState('');
  const [editPuntos, setEditPuntos] = useState<number | ''>('');

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setError(null);
      try {
        const acts = await getActividades();
        setActividades(acts.data || acts || []);
        const lecs = await getLecciones();
        setLecciones(lecs.data || lecs || []);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error desconocido');
      }
      setLoading(false);
    };
    cargar();
  }, []);

  const handleCrear = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); setSuccess(null);
    if (!leccionId || !tipo || !pregunta || !respuesta || !puntos) {
      setError('Completa todos los campos'); return;
    }
    setLoading(true);
    try {
      await createActividad({ leccion_id: Number(leccionId), tipo, pregunta, respuesta_correcta: respuesta, puntos_recompensa: Number(puntos) });
      setSuccess('Actividad creada exitosamente');
      setLeccionId(''); setTipo('quiz'); setPregunta(''); setRespuesta(''); setPuntos('');
      const acts = await getActividades();
      setActividades(acts.data || acts || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    }
    setLoading(false);
  };

  const handleEliminar = async (id: number) => {
    if (!window.confirm('¿Seguro que deseas eliminar esta actividad?')) return;
    setError(null); setSuccess(null); setLoading(true);
    try {
      await deleteActividad(id);
      setSuccess('Actividad eliminada exitosamente');
      const acts = await getActividades();
      setActividades(acts.data || acts || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    }
    setLoading(false);
  };

  const handleEditar = (a: Actividad) => {
    setEditId(a.id);
    setEditLeccionId(a.leccion_id ?? '');
    setEditTipo(a.tipo);
    setEditPregunta(a.pregunta);
    setEditRespuesta(a.respuesta_correcta ?? '');
    setEditPuntos(a.puntos_recompensa);
  };

  const handleGuardar = async (id: number) => {
    setError(null); setSuccess(null); setLoading(true);
    try {
      await updateActividad(id, {
        leccion_id: editLeccionId ? Number(editLeccionId) : undefined,
        tipo: editTipo,
        pregunta: editPregunta,
        respuesta_correcta: editRespuesta,
        puntos_recompensa: editPuntos ? Number(editPuntos) : undefined,
      });
      setSuccess('Actividad editada exitosamente');
      setEditId(null);
      const acts = await getActividades();
      setActividades(acts.data || acts || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error desconocido');
    }
    setLoading(false);
  };
  const handleCancelar = () => setEditId(null);

  return (
    <div className="actividades-panel">
      <h2 className="actividades-title">Actividades</h2>
      <form className="actividad-form card-form" onSubmit={handleCrear}>
        <select className="actividad-input" value={leccionId} onChange={e => setLeccionId(Number(e.target.value))} disabled={loading}>
          <option value="">Selecciona una lección</option>
          {lecciones.map(l => <option key={l.id} value={l.id}>{l.titulo}</option>)}
        </select>
        <select className="actividad-input" value={tipo} onChange={e => setTipo(e.target.value)} disabled={loading}>
          {tipos.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
        </select>
        <input className="actividad-input" type="text" placeholder="Pregunta" value={pregunta} onChange={e => setPregunta(e.target.value)} disabled={loading} />
        <input className="actividad-input" type="text" placeholder="Respuesta correcta" value={respuesta} onChange={e => setRespuesta(e.target.value)} disabled={loading} />
        <input className="actividad-input" type="number" placeholder="Puntos" value={puntos} onChange={e => setPuntos(Number(e.target.value))} disabled={loading} />
        <button className="actividad-btn crear" type="submit" disabled={loading}>+ Crear actividad</button>
      </form>
      {success && <div className="success-message">{success}</div>}
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Cargando actividades...</div>
      ) : actividades.length === 0 ? (
        <div className="no-actividades">No hay actividades registradas.</div>
      ) : (
        <div className="actividades-cards-list">
          {actividades.map(a => (
            <div className={`actividad-card${editId === a.id ? ' editando' : ''}`} key={a.id}>
              <div className="actividad-card-header">
                {tipoIcono(a.tipo)}
                <span className="actividad-card-tipo">{tipos.find(t => t.value === a.tipo)?.label || a.tipo}</span>
                <span className="actividad-card-leccion">{a.leccion?.titulo || a.leccion_id || '-'}</span>
              </div>
              {editId === a.id ? (
                <div className="actividad-card-body">
                  <select className="actividad-input" value={editLeccionId} onChange={e => setEditLeccionId(Number(e.target.value))}>
                    <option value="">Selecciona una lección</option>
                    {lecciones.map(l => <option key={l.id} value={l.id}>{l.titulo}</option>)}
                  </select>
                  <select className="actividad-input" value={editTipo} onChange={e => setEditTipo(e.target.value)}>
                    {tipos.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                  <input className="actividad-input" value={editPregunta} onChange={e => setEditPregunta(e.target.value)} placeholder="Pregunta" />
                  <input className="actividad-input" value={editRespuesta} onChange={e => setEditRespuesta(e.target.value)} placeholder="Respuesta correcta" />
                  <input className="actividad-input" type="number" value={editPuntos} onChange={e => setEditPuntos(Number(e.target.value))} placeholder="Puntos" />
                  <div className="actividad-card-actions">
                    <button className="actividad-btn guardar" onClick={() => handleGuardar(a.id)} disabled={loading}>Guardar</button>
                    <button className="actividad-btn cancelar" onClick={handleCancelar} disabled={loading}>Cancelar</button>
                  </div>
                </div>
              ) : (
                <div className="actividad-card-body">
                  <div className="actividad-card-pregunta"><strong>Pregunta:</strong> {a.pregunta}</div>
                  <div className="actividad-card-respuesta"><strong>Respuesta:</strong> {a.respuesta_correcta ?? '-'}</div>
                  <div className="actividad-card-puntos"><strong>Puntos:</strong> {a.puntos_recompensa}</div>
                  <div className="actividad-card-actions">
                    <button className="actividad-btn editar" onClick={() => handleEditar(a)} disabled={loading}><FaEdit /></button>
                    <button className="actividad-btn eliminar" onClick={() => handleEliminar(a.id)} disabled={loading}><FaTrash /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Actividades; 
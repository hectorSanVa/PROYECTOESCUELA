import React, { useEffect, useState } from 'react';
import './RespuestasIA.css';
import { getRespuestasIA } from '../../../services/ia';

interface RespuestaIAAlumno {
  id: number;
  alumno: string;
  actividad: string;
  fecha: string;
  estado: 'aprobada' | 'pendiente' | 'rechazada';
  respuesta: string;
}

const RespuestasIA: React.FC = () => {
  const [respuestas, setRespuestas] = useState<RespuestaIAAlumno[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getRespuestasIA();
        const datos = (res.data || res || []).map((r: any) => ({
          id: r.id,
          alumno: r.alumno?.nombre || r.alumno_id || '-',
          actividad: r.actividad?.pregunta || r.actividad_id || '-',
          fecha: r.timestamp ? r.timestamp.split('T')[0] : '-',
          estado: r.estado || 'pendiente',
          respuesta: r.feedback_ia || '-',
        }));
        setRespuestas(datos);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al cargar respuestas IA');
      }
      setLoading(false);
    };
    cargar();
  }, []);

  return (
    <div className="respuestasia-panel">
      <h2 className="respuestasia-title">Respuestas IA</h2>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Cargando respuestas IA...</div>
      ) : (
        <table className="respuestasia-table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Actividad</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Respuesta</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {respuestas.map((r) => (
              <tr key={r.id}>
                <td>{r.alumno}</td>
                <td>{r.actividad}</td>
                <td>{r.fecha}</td>
                <td><span className={`estado ${r.estado}`}>{r.estado.charAt(0).toUpperCase() + r.estado.slice(1)}</span></td>
                <td>{r.respuesta}</td>
                <td>
                  <button className="respuestasia-btn ver">Ver detalle</button>
                  <button className="respuestasia-btn aprobar">Aprobar</button>
                  <button className="respuestasia-btn rechazar">Rechazar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RespuestasIA; 
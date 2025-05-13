import React, { useEffect, useState } from 'react';
import './Progreso.css';
import { getProgresos } from '../../../services/progreso';

interface ProgresoAlumno {
  id: number;
  alumno: string;
  curso: string;
  porcentaje: number;
  completadas: number;
  total: number;
  ultimaActividad: string;
}

const Progreso: React.FC = () => {
  const [progresos, setProgresos] = useState<ProgresoAlumno[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getProgresos();
        // Mapear los datos anidados del backend a la estructura de la tabla
        const datos = (res.data || res || []).map((p: any) => {
          // Calcular completadas y total por curso
          const completadas = p.completado ? 1 : 0;
          const total = 1; // Si tienes el total real de actividades por curso, cámbialo aquí
          return {
            id: p.id,
            alumno: p.alumno?.nombre || p.alumno_id || '-',
            curso: p.actividad?.leccion?.curso?.nombre || p.actividad?.leccion?.titulo || '-',
            porcentaje: completadas / total * 100,
            completadas,
            total,
            ultimaActividad: p.actividad?.pregunta || '-',
          };
        });
        setProgresos(datos);
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al cargar el progreso');
      }
      setLoading(false);
    };
    cargar();
  }, []);

  return (
    <div className="progreso-panel">
      <h2 className="progreso-title">Progreso de Alumnos</h2>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Cargando progreso...</div>
      ) : (
        <table className="progreso-table">
          <thead>
            <tr>
              <th>Alumno</th>
              <th>Curso</th>
              <th>Progreso</th>
              <th>Completadas</th>
              <th>Última Actividad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {progresos.map((p) => (
              <tr key={p.id}>
                <td>{p.alumno}</td>
                <td>{p.curso}</td>
                <td>
                  <div className="barra-progreso">
                    <div className="progreso-fill" style={{width: `${p.porcentaje}%`}}></div>
                  </div>
                  <span className="progreso-porcentaje">{Math.round(p.porcentaje)}%</span>
                </td>
                <td>{p.completadas}/{p.total}</td>
                <td>{p.ultimaActividad}</td>
                <td>
                  <button className="progreso-btn ver">Ver detalle</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Progreso; 
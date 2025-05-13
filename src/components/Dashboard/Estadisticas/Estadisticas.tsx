import React, { useEffect, useState } from 'react';
import './Estadisticas.css';
import { getCursos } from '../../../services/cursos';
import { getAlumnos } from '../../../services/alumnos';
import { getActividades } from '../../../services/actividades';
import { getRecompensas } from '../../../services/recompensas';
import { getProgresos } from '../../../services/progreso';

const Estadisticas: React.FC = () => {
  const [stats, setStats] = useState({
    totalCursos: 0,
    totalAlumnos: 0,
    totalActividades: 0,
    promedioProgreso: 0,
    recompensasEntregadas: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const cargar = async () => {
      setLoading(true);
      setError(null);
      try {
        const [cursos, alumnos, actividades, recompensas, progresos] = await Promise.all([
          getCursos(),
          getAlumnos(),
          getActividades(),
          getRecompensas(),
          getProgresos(),
        ]);
        // Calcular promedio de progreso
        let promedioProgreso = 0;
        const progresosArr = progresos.data || progresos || [];
        if (progresosArr.length > 0) {
          // Si cada progreso tiene un campo porcentaje, úsalo; si no, calcula por completado
          const porcentajes = progresosArr.map((p: any) => p.porcentaje || (p.completado ? 100 : 0));
          promedioProgreso = Math.round(porcentajes.reduce((a: number, b: number) => a + b, 0) / porcentajes.length);
        }
        setStats({
          totalCursos: (cursos.data || cursos || []).length,
          totalAlumnos: (alumnos.data || alumnos || []).length,
          totalActividades: (actividades.data || actividades || []).length,
          promedioProgreso,
          recompensasEntregadas: (recompensas.data || recompensas || []).length,
        });
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Error al cargar estadísticas');
      }
      setLoading(false);
    };
    cargar();
  }, []);

  return (
    <div className="estadisticas-panel">
      <h2 className="estadisticas-title">Estadísticas</h2>
      {error && <div className="error-message">{error}</div>}
      {loading ? (
        <div className="loading">Cargando estadísticas...</div>
      ) : (
        <div className="estadisticas-grid">
          <div className="estadistica-card">
            <span className="icon">📚</span>
            <div className="estadistica-label">Cursos</div>
            <div className="estadistica-valor">{stats.totalCursos}</div>
          </div>
          <div className="estadistica-card">
            <span className="icon">👨‍🎓</span>
            <div className="estadistica-label">Alumnos</div>
            <div className="estadistica-valor">{stats.totalAlumnos}</div>
          </div>
          <div className="estadistica-card">
            <span className="icon">📝</span>
            <div className="estadistica-label">Actividades</div>
            <div className="estadistica-valor">{stats.totalActividades}</div>
          </div>
          <div className="estadistica-card">
            <span className="icon">📈</span>
            <div className="estadistica-label">Progreso Promedio</div>
            <div className="estadistica-valor">{stats.promedioProgreso}%</div>
          </div>
          <div className="estadistica-card">
            <span className="icon">🏆</span>
            <div className="estadistica-label">Recompensas</div>
            <div className="estadistica-valor">{stats.recompensasEntregadas}</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Estadisticas; 
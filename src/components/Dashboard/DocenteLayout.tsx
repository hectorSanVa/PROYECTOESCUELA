import React from 'react';
import './DocenteLayout.css';
import { supabase } from '../../supabaseClient';

const SECCIONES = [
  { key: 'cursos', label: 'Mis Cursos', icon: '📚' },
  { key: 'lecciones', label: 'Lecciones', icon: '📖' },
  { key: 'actividades', label: 'Actividades', icon: '📝' },
  { key: 'progreso', label: 'Progreso', icon: '📊' },
  { key: 'recompensas', label: 'Recompensas', icon: '🏆' },
  { key: 'ia', label: 'Respuestas IA', icon: '🤖' },
  { key: 'estadisticas', label: 'Estadísticas', icon: '📈' },
];

type DocenteLayoutProps = {
  children?: React.ReactNode;
  seccion: string;
  setSeccion: (s: string) => void;
};

const DocenteLayout: React.FC<DocenteLayoutProps> = ({ children, seccion, setSeccion }) => {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = '/login';
  };
  return (
    <div className="docente-dashboard">
      <aside className="sidebar-docente">
        <div className="sidebar-header">Panel Docente</div>
        <nav>
          {SECCIONES.map((s) => (
            <button
              key={s.key}
              className={`sidebar-btn${seccion === s.key ? ' active' : ''}`}
              onClick={() => setSeccion(s.key)}
            >
              <span className="sidebar-icon">{s.icon}</span>
              {s.label}
            </button>
          ))}
        </nav>
      </aside>
      <main className="main-docente">
        <header className="topbar-docente">
          <div className="topbar-title">{SECCIONES.find(s => s.key === seccion)?.label}</div>
          <button className="logout-btn" onClick={handleLogout}>Cerrar sesión</button>
        </header>
        <section className="main-content-docente">
          {/* Aquí irá el contenido de cada sección */}
          {children}
        </section>
      </main>
    </div>
  );
};

export default DocenteLayout; 
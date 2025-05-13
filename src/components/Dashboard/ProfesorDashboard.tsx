import React, { useState } from 'react';
import './ProfesorDashboard.css';

interface Curso {
  id: number;
  titulo: string;
  descripcion: string;
  imagen: string;
  profesor: string;
  rating: number;
  alumnos: string;
  lecciones: number;
  tags: string[];
}

const cursos: Curso[] = [
  {
    id: 1,
    titulo: 'Geometría Básica',
    descripcion: 'Aprende los conceptos fundamentales de geometría: puntos, líneas, ángulos y figuras básicas.',
    imagen: '/images/geometry.jpg',
    profesor: 'Prof. García',
    rating: 5,
    alumnos: '45+ Alumnos',
    lecciones: 12,
    tags: ['geometría', 'figuras', 'ángulos']
  },
  {
    id: 2,
    titulo: 'Introducción al Álgebra',
    descripcion: 'Fundamentos algebraicos: ecuaciones, variables y operaciones básicas.',
    imagen: '/images/algebra.jpg',
    profesor: 'Prof. Martínez',
    rating: 4,
    alumnos: '30+ Alumnos',
    lecciones: 8,
    tags: ['álgebra', 'ecuaciones', 'variables']
  },
  {
    id: 3,
    titulo: 'Razones y Proporciones',
    descripcion: 'Matemáticas aplicadas a problemas reales usando proporciones.',
    imagen: '/images/proportions.jpg',
    profesor: 'Prof. López',
    rating: 5,
    alumnos: '60+ Alumnos',
    lecciones: 15,
    tags: ['proporciones', 'razones', 'aplicaciones']
  }
];

const ProfesorDashboard: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState('todos');
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="profesor-dashboard">
      <header className="header">
        <div className="nav-container">
          <a href="/" className="logo">
            <img src="/logo.png" alt="EduBot" />
            <span>EduBot</span>
          </a>
          <div className="nav-buttons">
            <button className="nav-button">Perfil</button>
            <button className="nav-button">Cerrar Sesión</button>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1>Bienvenido, <span>Profesor</span></h1>
          <p>Gestiona tus cursos y sigue el progreso de tus alumnos.</p>
          
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="Buscar curso..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="search-button">Buscar</button>
          </div>

          <div className="quick-stats">
            <div className="stat-card">
              <h3>Total Cursos</h3>
              <p>12</p>
            </div>
            <div className="stat-card">
              <h3>Total Alumnos</h3>
              <p>156</p>
            </div>
            <div className="stat-card">
              <h3>Lecciones Creadas</h3>
              <p>48</p>
            </div>
          </div>
        </div>
      </section>

      <section className="cursos">
        <div className="section-header">
          <h2 className="section-title">Mis <span>Cursos</span></h2>
          <div className="filter-buttons">
            <button
              className={`filter-button ${activeFilter === 'todos' ? 'active' : ''}`}
              onClick={() => setActiveFilter('todos')}
            >
              Todos
            </button>
            <button
              className={`filter-button ${activeFilter === 'activos' ? 'active' : ''}`}
              onClick={() => setActiveFilter('activos')}
            >
              Activos
            </button>
            <button
              className={`filter-button ${activeFilter === 'finalizados' ? 'active' : ''}`}
              onClick={() => setActiveFilter('finalizados')}
            >
              Finalizados
            </button>
          </div>
        </div>

        <div className="cursos-grid">
          {cursos.map((curso) => (
            <div key={curso.id} className="curso-card">
              <img src={curso.imagen} alt={curso.titulo} className="curso-image" />
              <div className="curso-content">
                <h3>{curso.titulo}</h3>
                <p>{curso.descripcion}</p>
                <div className="curso-stats">
                  <span>{curso.alumnos}</span>
                  <span>{curso.lecciones} lecciones</span>
                </div>
                <div className="curso-tags">
                  {curso.tags.map((tag, index) => (
                    <span key={index} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="curso-actions">
                  <button className="action-button edit">Editar</button>
                  <button className="action-button view">Ver Detalles</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProfesorDashboard; 
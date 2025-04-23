import React, { useState, useEffect, useMemo } from 'react';
import './Home.css';
import LoginButton from './Auth/LoginButton';

interface Exercise {
  id: number;
  title: string;
  description: string;
  image: string;
  author: string;
  rating: number;
  students: string;
  subject: 'math' | 'spanish';
  difficulty: 'básico' | 'intermedio' | 'avanzado';
  tags: string[];
}

const mathExercises: Exercise[] = [
  {
    id: 1,
    title: 'Geometría Básica',
    description: 'Aprende los conceptos fundamentales de geometría: puntos, líneas, ángulos y figuras básicas.',
    image: '/images/geometry.jpg',
    author: 'Prof. García',
    rating: 5,
    students: '45+ Students',
    subject: 'math',
    difficulty: 'básico',
    tags: ['geometría', 'figuras', 'ángulos']
  },
  {
    id: 2,
    title: 'Introducción al Álgebra',
    description: 'Fundamentos algebraicos: ecuaciones, variables y operaciones básicas.',
    image: '/images/algebra.jpg',
    author: 'Prof. Martínez',
    rating: 4,
    students: '30+ Students',
    subject: 'math',
    difficulty: 'intermedio',
    tags: ['álgebra', 'ecuaciones', 'variables']
  },
  {
    id: 3,
    title: 'Razones y Proporciones',
    description: 'Matemáticas aplicadas a problemas reales usando proporciones.',
    image: '/images/proportions.jpg',
    author: 'Prof. López',
    rating: 5,
    students: '60+ Students',
    subject: 'math',
    difficulty: 'intermedio',
    tags: ['proporciones', 'razones', 'aplicaciones']
  }
];

const spanishExercises: Exercise[] = [
  {
    id: 4,
    title: 'Gramática Básica',
    description: 'Fundamentos del lenguaje: sustantivos, verbos y estructura de oraciones.',
    image: '/images/grammar.jpg',
    author: 'Prof. Ruiz',
    rating: 5,
    students: '50+ Students',
    subject: 'spanish',
    difficulty: 'básico',
    tags: ['gramática', 'verbos', 'sustantivos']
  },
  {
    id: 5,
    title: 'Comprensión Lectora',
    description: 'Técnicas avanzadas de lectura y análisis de textos.',
    image: '/images/reading.jpg',
    author: 'Prof. Torres',
    rating: 4,
    students: '40+ Students',
    subject: 'spanish',
    difficulty: 'avanzado',
    tags: ['lectura', 'comprensión', 'análisis']
  },
  {
    id: 6,
    title: 'Ortografía Avanzada',
    description: 'Reglas ortográficas y su aplicación en la escritura.',
    image: '/images/spelling.jpg',
    author: 'Prof. Díaz',
    rating: 5,
    students: '35+ Students',
    subject: 'spanish',
    difficulty: 'avanzado',
    tags: ['ortografía', 'escritura', 'reglas']
  }
];

const Home: React.FC = () => {
  // Estados principales
  const [currentSubject, setCurrentSubject] = useState<'math' | 'spanish'>('math');
  const [activeFilter, setActiveFilter] = useState('populares');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('todos');
  const [showFilters, setShowFilters] = useState(false);

  // Estado para animaciones y UI
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [visibleExercises, setVisibleExercises] = useState(3);

  // Obtener ejercicios según la materia actual
  const allExercises = currentSubject === 'math' ? mathExercises : spanishExercises;

  // Filtrar ejercicios según búsqueda y filtros
  const filteredExercises = useMemo(() => {
    return allExercises.filter(exercise => {
      const matchesSearch = searchTerm === '' || 
        exercise.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        exercise.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesDifficulty = selectedDifficulty === 'todos' || 
        exercise.difficulty === selectedDifficulty;

      return matchesSearch && matchesDifficulty;
    });
  }, [allExercises, searchTerm, selectedDifficulty]);

  // Ordenar ejercicios según el filtro activo
  const sortedExercises = useMemo(() => {
    const exercises = [...filteredExercises];
    switch (activeFilter) {
      case 'populares':
        return exercises.sort((a, b) => 
          parseInt(b.students) - parseInt(a.students));
      case 'nuevos':
        return exercises.sort((a, b) => b.id - a.id);
      case 'destacados':
        return exercises.sort((a, b) => b.rating - a.rating);
      default:
        return exercises;
    }
  }, [filteredExercises, activeFilter]);

  // Temas según la materia seleccionada
  const currentTopics = currentSubject === 'math' 
    ? ['Álgebra', 'Geometría', 'Trigonometría', 'Estadística'] 
    : ['Gramática', 'Lectura', 'Ortografía', 'Redacción'];

  // Efecto para simular carga de más ejercicios
  useEffect(() => {
    if (loadingMore) {
      const timer = setTimeout(() => {
        setVisibleExercises(prev => Math.min(prev + 3, sortedExercises.length));
        setLoadingMore(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [loadingMore, sortedExercises.length]);

  // Manejadores de eventos
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setVisibleExercises(3);
  };

  const handleLoadMore = () => {
    setLoadingMore(true);
  };

  const handleSubjectChange = (subject: 'math' | 'spanish') => {
    setCurrentSubject(subject);
    setSearchTerm('');
    setSelectedDifficulty('todos');
    setVisibleExercises(3);
  };

  return (
    <div className="home">
      <header className="header">
        <div className="nav-container">
          <a href="/" className="logo">
            <img src="/logo.png" alt="EduBot" />
            <span>EduBot</span>
          </a>
          <div className="nav-buttons">
            <button className="nav-button">Iniciar sesión</button>
            <button className="nav-button">Registrarse</button>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-content">
          <h1>Los mejores cursos <span>están a la espera de enriquecer tu habilidad</span></h1>
          <p>La plataforma se utiliza activos de aprendizaje en línea y material que ayuda a que los estudiantes triunfen.</p>
          
          <div className="search-bar">
            <input
              type="text"
              className="search-input"
              placeholder="¿Qué deseas aprender?"
            />
            <button className="search-button">Buscar</button>
          </div>

          <div className="subjects-nav">
            <button
              className={`subject-item ${currentSubject === 'math' ? 'active' : ''}`}
              onClick={() => handleSubjectChange('math')}
            >
              Matemáticas
            </button>
            <button
              className={`subject-item ${currentSubject === 'spanish' ? 'active' : ''}`}
              onClick={() => handleSubjectChange('spanish')}
            >
              Español
            </button>
          </div>
        </div>
      </section>

      <section className="exercises">
        <div className="section-header">
          <h2 className="section-title">Ejercicios <span>Populares</span></h2>
          <div className="filter-buttons">
            <button
              className={`filter-button ${activeFilter === 'populares' ? 'active' : ''}`}
              onClick={() => setActiveFilter('populares')}
            >
              Populares
            </button>
            <button
              className={`filter-button ${activeFilter === 'nuevos' ? 'active' : ''}`}
              onClick={() => setActiveFilter('nuevos')}
            >
              Nuevos
            </button>
            <button
              className={`filter-button ${activeFilter === 'destacados' ? 'active' : ''}`}
              onClick={() => setActiveFilter('destacados')}
            >
              Destacados
            </button>
          </div>
        </div>

        <div className="exercises-grid">
          {sortedExercises.slice(0, visibleExercises).map((exercise) => (
            <div key={exercise.id} className="exercise-card">
              <img src={exercise.image} alt={exercise.title} className="exercise-image" />
              <div className="exercise-content">
                <h3 className="exercise-title">{exercise.title}</h3>
                <div className="exercise-meta">
                  <div className="author">
                    <img src="/avatar-placeholder.png" alt="" className="author-avatar" />
                    <span>{exercise.author}</span>
                  </div>
                  <div className="rating">★ {exercise.rating}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="topics">
        <div className="topics-content">
          <h2 className="section-title">Temas <span>Populares</span></h2>
          <div className="topics-grid">
            {currentTopics.map((topic, index) => (
              <div key={index} className="topic-item">
                <span>{topic}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="stats">
        <div className="stats-content">
          <h2 className="stats-title">
            Aprende, practica y domina: <span>tu compañero inteligente para el éxito escolar</span>
          </h2>
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">300+</div>
              <div className="stat-label">Ejercicios</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">20,000+</div>
              <div className="stat-label">Estudiantes</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">10,000+</div>
              <div className="stat-label">Evaluaciones</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-left">
            <h2 className="footer-title">Únete a Nuestra Plataforma de Aprendizaje</h2>
            <div className="footer-buttons">
              <button className="footer-button primary">Registrarse Ahora</button>
              <button className="footer-button secondary">Saber más</button>
            </div>
          </div>
          <div className="footer-right">
            <img src="/logo.png" alt="EduBot" className="footer-logo" />
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home; 
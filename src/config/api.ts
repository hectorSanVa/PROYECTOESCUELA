export const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
  },
  ALUMNOS: {
    BASE: '/alumnos',
    PROGRESO: '/alumnos/progreso',
  },
  PROFESORES: {
    BASE: '/profesores',
  },
  CURSOS: {
    BASE: '/cursos',
  },
  LECCIONES: {
    BASE: '/lecciones',
  },
  ACTIVIDADES: {
    BASE: '/actividades',
  },
  RECOMPENSAS: {
    BASE: '/recompensas',
  },
  IA: {
    RESPUESTAS: '/ia/respuestas',
  },
}; 
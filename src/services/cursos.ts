import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const getCursos = () => api.get(API_ENDPOINTS.CURSOS.BASE);
export const getCursoById = (id: string) => api.get(`${API_ENDPOINTS.CURSOS.BASE}/${id}`);
export const getCursosByProfesor = (profesorId: string) => api.get(`${API_ENDPOINTS.CURSOS.BASE}/profesor/${profesorId}`);
export const createCurso = (curso: any) => api.post(API_ENDPOINTS.CURSOS.BASE, curso);
export const updateCurso = (id: string, curso: any) => api.put(`${API_ENDPOINTS.CURSOS.BASE}/${id}`, curso);
export const deleteCurso = (id: string) => api.delete(`${API_ENDPOINTS.CURSOS.BASE}/${id}`); 
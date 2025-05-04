import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const getLecciones = () => api.get(API_ENDPOINTS.LECCIONES.BASE);
export const getLeccionById = (id: string) => api.get(`${API_ENDPOINTS.LECCIONES.BASE}/${id}`);
export const getLeccionesByCurso = (cursoId: string) => api.get(`${API_ENDPOINTS.LECCIONES.BASE}/curso/${cursoId}`);
export const createLeccion = (leccion: any) => api.post(API_ENDPOINTS.LECCIONES.BASE, leccion);
export const updateLeccion = (id: string, leccion: any) => api.put(`${API_ENDPOINTS.LECCIONES.BASE}/${id}`, leccion);
export const deleteLeccion = (id: string) => api.delete(`${API_ENDPOINTS.LECCIONES.BASE}/${id}`); 
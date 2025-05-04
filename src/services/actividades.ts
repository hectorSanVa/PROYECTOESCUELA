import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const getActividades = () => api.get(API_ENDPOINTS.ACTIVIDADES.BASE);
export const getActividadById = (id: string) => api.get(`${API_ENDPOINTS.ACTIVIDADES.BASE}/${id}`);
export const getActividadesByLeccion = (leccionId: string) => api.get(`${API_ENDPOINTS.ACTIVIDADES.BASE}/leccion/${leccionId}`);
export const createActividad = (actividad: any) => api.post(API_ENDPOINTS.ACTIVIDADES.BASE, actividad);
export const updateActividad = (id: string, actividad: any) => api.put(`${API_ENDPOINTS.ACTIVIDADES.BASE}/${id}`, actividad);
export const deleteActividad = (id: string) => api.delete(`${API_ENDPOINTS.ACTIVIDADES.BASE}/${id}`); 
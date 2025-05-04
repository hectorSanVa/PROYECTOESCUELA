import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const getRecompensas = () => api.get(API_ENDPOINTS.RECOMPENSAS.BASE);
export const getRecompensaById = (id: string) => api.get(`${API_ENDPOINTS.RECOMPENSAS.BASE}/${id}`);
export const getRecompensasByAlumno = (alumnoId: string) => api.get(`${API_ENDPOINTS.RECOMPENSAS.BASE}/alumno/${alumnoId}`);
export const createRecompensa = (recompensa: any) => api.post(API_ENDPOINTS.RECOMPENSAS.BASE, recompensa);
export const updateRecompensa = (id: string, recompensa: any) => api.put(`${API_ENDPOINTS.RECOMPENSAS.BASE}/${id}`, recompensa);
export const deleteRecompensa = (id: string) => api.delete(`${API_ENDPOINTS.RECOMPENSAS.BASE}/${id}`); 
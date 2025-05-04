import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const getProgresos = () => api.get(API_ENDPOINTS.ALUMNOS.PROGRESO);
export const getProgresoById = (id: string) => api.get(`${API_ENDPOINTS.ALUMNOS.PROGRESO}/${id}`);
export const getProgresoByAlumnoAndActividad = (alumnoId: string, actividadId: string) => api.get(`${API_ENDPOINTS.ALUMNOS.PROGRESO}/alumno/${alumnoId}/actividad/${actividadId}`);
export const createProgreso = (progreso: any) => api.post(API_ENDPOINTS.ALUMNOS.PROGRESO, progreso);
export const updateProgreso = (id: string, progreso: any) => api.put(`${API_ENDPOINTS.ALUMNOS.PROGRESO}/${id}`, progreso);
export const deleteProgreso = (id: string) => api.delete(`${API_ENDPOINTS.ALUMNOS.PROGRESO}/${id}`); 
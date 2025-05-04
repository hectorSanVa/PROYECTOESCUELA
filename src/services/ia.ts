import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const getRespuestasIA = () => api.get(API_ENDPOINTS.IA.RESPUESTAS);
export const getRespuestaIAById = (id: string) => api.get(`${API_ENDPOINTS.IA.RESPUESTAS}/${id}`);
export const getRespuestasIAByAlumnoAndActividad = (alumnoId: string, actividadId: string) => api.get(`${API_ENDPOINTS.IA.RESPUESTAS}/alumno/${alumnoId}/actividad/${actividadId}`);
export const createRespuestaIA = (respuesta: any) => api.post(API_ENDPOINTS.IA.RESPUESTAS, respuesta);
export const updateRespuestaIA = (id: string, respuesta: any) => api.put(`${API_ENDPOINTS.IA.RESPUESTAS}/${id}`, respuesta);
export const deleteRespuestaIA = (id: string) => api.delete(`${API_ENDPOINTS.IA.RESPUESTAS}/${id}`); 
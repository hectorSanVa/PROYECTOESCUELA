import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const getAlumnos = () => api.get(API_ENDPOINTS.ALUMNOS.BASE);
export const getAlumnoById = (id: string) => api.get(`${API_ENDPOINTS.ALUMNOS.BASE}/${id}`);
export const createAlumno = (alumno: any) => api.post(API_ENDPOINTS.ALUMNOS.BASE, alumno);
export const updateAlumno = (id: string, alumno: any) => api.put(`${API_ENDPOINTS.ALUMNOS.BASE}/${id}`, alumno);
export const deleteAlumno = (id: string) => api.delete(`${API_ENDPOINTS.ALUMNOS.BASE}/${id}`); 
import api from './api';
import { API_ENDPOINTS } from '../config/api';

export const getProfesores = () => api.get(API_ENDPOINTS.PROFESORES.BASE);
export const getProfesorById = (id: string) => api.get(`${API_ENDPOINTS.PROFESORES.BASE}/${id}`);
export const createProfesor = (profesor: any) => api.post(API_ENDPOINTS.PROFESORES.BASE, profesor);
export const updateProfesor = (id: string, profesor: any) => api.put(`${API_ENDPOINTS.PROFESORES.BASE}/${id}`, profesor);
export const deleteProfesor = (id: string) => api.delete(`${API_ENDPOINTS.PROFESORES.BASE}/${id}`); 
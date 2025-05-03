// src/models/Alumno.ts
import { Usuario, UsuarioCreate } from './Usuario';

export interface Alumno {
  id: string;
  nombre: string;
  nivel_educativo: 'secundaria_1' | 'secundaria_2' | 'secundaria_3';
  puntos_acumulados: number;
  usuario?: Usuario;
}

export interface AlumnoCreate {
  nombre: string;
  nivel_educativo: 'secundaria_1' | 'secundaria_2' | 'secundaria_3';
  usuario: UsuarioCreate; // Usa UsuarioCreate que incluye password
}

export type AlumnoUpdate = Partial<Omit<Alumno, 'id' | 'usuario'>>;
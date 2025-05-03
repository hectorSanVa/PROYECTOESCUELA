// src/models/Leccion.ts
import { Curso } from './Curso';

export interface Leccion {
  id: number;
  curso_id: number;
  titulo: string;
  orden: number;
  duracion_estimada_min?: number;
  curso?: Curso;
}

export type LeccionCreate = Omit<Leccion, 'id' | 'curso'>;
export type LeccionUpdate = Partial<Omit<Leccion, 'id' | 'curso'>>;
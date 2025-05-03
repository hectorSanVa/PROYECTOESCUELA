// src/models/Curso.ts
import { Profesor } from './Profesor';

export interface Curso {
  id: number;
  nombre: string;
  descripcion?: string;
  profesor_id: string;
  materia: 'español' | 'matematicas';
  icono_url?: string;
  profesor?: Profesor;
}

export type CursoCreate = Omit<Curso, 'id' | 'profesor'>;
export type CursoUpdate = Partial<Omit<Curso, 'id' | 'profesor'>>;
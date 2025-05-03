// src/models/ProgresoAlumno.ts
import { Alumno } from './Alumno';
import { Actividad } from './Actividad';

export interface ProgresoAlumno {
  id: number;
  alumno_id: string;
  actividad_id: number;
  completado: boolean;
  fecha_completado?: Date;
  puntaje_obtenido?: number;
  respuestas_usuario?: any;
  alumno?: Alumno;
  actividad?: Actividad;
}

// Tipo para la relación con actividad
export interface ActividadWithPuntos {
  puntos_recompensa: number;
}

export type ProgresoWithRelations = ProgresoAlumno & {
  actividad: ActividadWithPuntos;
};

export type ProgresoAlumnoCreate = Omit<ProgresoAlumno, 'id' | 'alumno' | 'actividad'>;
export type ProgresoAlumnoUpdate = Partial<Omit<ProgresoAlumno, 'id' | 'alumno' | 'actividad'>>;
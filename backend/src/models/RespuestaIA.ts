// src/models/RespuestaIA.ts
import { Actividad } from './Actividad';
import { Alumno } from './Alumno';

export interface RespuestaIA {
  id: number;
  actividad_id: number;
  alumno_id: string;
  feedback_ia?: string;
  sugerencias_ia?: any; // jsonb
  timestamp: Date;
  actividad?: Actividad;
  alumno?: Alumno;
}

export type RespuestaIACreate = Omit<RespuestaIA, 'id' | 'timestamp' | 'actividad' | 'alumno'>;
export type RespuestaIAUpdate = Partial<Omit<RespuestaIA, 'id' | 'timestamp' | 'actividad' | 'alumno'>>;
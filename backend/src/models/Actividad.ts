// src/models/Actividad.ts
import { Leccion } from './Leccion';

export type TipoActividad = 'quiz' | 'arrastrar_soltar' | 'juego_palabras' | 'problema_matematico';

export interface Actividad {
  id: number;
  leccion_id?: number;
  tipo: TipoActividad;
  pregunta: string;
  opciones?: any; // jsonb
  respuesta_correcta?: string;
  puntos_recompensa: number;
  datos_ia?: any; // jsonb
  leccion?: Leccion;
}

export type ActividadCreate = Omit<Actividad, 'id' | 'leccion'>;
export type ActividadUpdate = Partial<Omit<Actividad, 'id' | 'leccion'>>;
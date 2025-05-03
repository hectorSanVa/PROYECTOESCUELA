// src/models/Recompensa.ts
import { Alumno } from './Alumno';

export type TipoRecompensa = 'medalla' | 'insignia' | 'puntos_extra';

export interface Recompensa {
  id: number;
  alumno_id: string;
  tipo: TipoRecompensa;
  imagen_url?: string;
  descripcion?: string;
  alumno?: Alumno;
}

export interface RecompensaCreate extends Omit<Recompensa, 'id' | 'alumno'> {}
export interface RecompensaUpdate extends Partial<Omit<Recompensa, 'id' | 'alumno'>> {}
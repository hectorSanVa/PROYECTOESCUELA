// src/models/Profesor.ts
import { Usuario } from './Usuario';

export interface Profesor {
  id: string;
  nombre: string;
  especialidad: 'español' | 'matematicas';
  usuario?: Usuario;
}

export type ProfesorCreate = Omit<Profesor, 'id' | 'usuario'> & {
  usuario: Omit<Usuario, 'id' | 'fecha_registro'>;
};

export type ProfesorUpdate = Partial<Omit<Profesor, 'id' | 'usuario'>>;
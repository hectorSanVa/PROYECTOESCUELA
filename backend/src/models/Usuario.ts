// src/models/Usuario.ts
export interface Usuario {
    id: string;
    email: string;
    password_hash: string;
    rol: 'alumno' | 'profesor' | 'admin';
    fecha_registro: Date;
    avatar_url?: string;
  }

  export interface RegistroRequest extends UsuarioCreate {
    password: string; // Solo para el endpoint de registro
  }
  export interface UsuarioCreate extends Omit<Usuario, 'id' | 'fecha_registro'> {
    password: string; // Para el registro, no se almacena directamente
  }
  export type UsuarioUpdate = Partial<Omit<Usuario, 'id' | 'fecha_registro'>>;
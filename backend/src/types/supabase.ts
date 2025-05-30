// src/types/supabase.ts
export type Database = {
    public: {
      Tables: {
        usuarios: {
          Row: {
            id: string
            email: string
            password_hash: string
            rol: string
            fecha_registro: string
            avatar_url?: string | null
          }
          Insert: {
            id?: string
            email: string
            password_hash: string
            rol: string
            fecha_registro?: string
            avatar_url?: string | null
          }
          Update: {
            id?: string
            email?: string
            password_hash?: string
            rol?: string
            fecha_registro?: string
            avatar_url?: string | null
          }
        }
        // Añade otras tablas según sea necesario
      }
    }
  }
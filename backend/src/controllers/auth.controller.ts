// src/controllers/auth.controller.ts
import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcrypt';
import { RegistroRequest, Usuario } from '../models/Usuario'; // Añade Usuario al import

export const register = async (req: Request, res: Response) => {
  try {
    const { email, password, rol, avatar_url } = req.body as RegistroRequest;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // 1. Registrar usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    });

    if (authError) throw authError;
    if (!authData.user?.id) throw new Error('Error al crear usuario en Auth');

    // 2. Hashear contraseña
    const password_hash = await bcrypt.hash(password, 10);

    // 3. Crear objeto con datos del usuario
    const usuarioData = {
      id: authData.user.id,
      email,
      rol,
      avatar_url: avatar_url || undefined, // Asegura que sea undefined en lugar de null
      fecha_registro: new Date().toISOString(),
      password_hash
    };

    // 4. Insertar en la tabla usuarios
    const { data: userDataResult, error: userError } = await supabase
      .from('usuarios')
      .insert(usuarioData)
      .select()
      .single();

    if (userError) throw userError;

    // 5. Preparar respuesta sin datos sensibles
    const responseData = {
      id: userDataResult.id,
      email: userDataResult.email,
      rol: userDataResult.rol,
      avatar_url: userDataResult.avatar_url,
      fecha_registro: userDataResult.fecha_registro
    };

    res.status(201).json(responseData);

  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error desconocido durante el registro' });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body as { email: string; password: string };

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('id, rol, avatar_url')
      .eq('id', data.user.id)
      .single()
      .returns<Pick<Usuario, 'id' | 'rol' | 'avatar_url'>>();

    if (userError) throw userError;

    res.json({
      session: data,
      user: {
        id: usuario.id,
        email: data.user.email,
        rol: usuario.rol,
        avatar_url: usuario.avatar_url
      }
    });

  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(401).json({ error: 'Credenciales inválidas' });
    } else {
      res.status(500).json({ error: 'Error desconocido durante el login' });
    }
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    const { data, error } = await supabase
      .from('usuarios')
      .select('id, email, rol, avatar_url, fecha_registro')
      .eq('id', userId)
      .single()
      .returns<Pick<Usuario, 'id' | 'email' | 'rol' | 'avatar_url' | 'fecha_registro'>>();

    if (error) throw error;

    res.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error al obtener perfil' });
    }
  }
};
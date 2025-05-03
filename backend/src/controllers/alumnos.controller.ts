// src/controllers/alumnos.controller.ts
import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import bcrypt from 'bcrypt';
import { AlumnoCreate, AlumnoUpdate } from '../models/Alumno';

export const getAllAlumnos = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('alumnos')
      .select('*, usuario:usuarios(*)');

    if (error) throw error;
    res.json(data);
  } catch (error: unknown) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
}};

export const getAlumnoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('alumnos')
      .select('*, usuario:usuarios(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: unknown) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
}};

export const createAlumno = async (req: Request, res: Response) => {
  try {
    const { usuario, ...alumnoData } = req.body as AlumnoCreate;

    // Validación básica
    if (!usuario.email || !usuario.password) {
      return res.status(400).json({ error: 'Email y contraseña son requeridos' });
    }

    // 1. Registrar usuario en Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: usuario.email,
      password: usuario.password,
    });

    if (authError) throw authError;
    if (!authData.user?.id) throw new Error('Error al crear usuario en Auth');

    // 2. Hashear contraseña
    const password_hash = await bcrypt.hash(usuario.password, 10);

    // 3. Crear registro en tabla usuarios
    const { error: userError } = await supabase
      .from('usuarios')
      .insert({
        id: authData.user.id,
        email: usuario.email,
        password_hash,
        rol: 'alumno',
        avatar_url: usuario.avatar_url,
      });

    if (userError) throw userError;

    // 4. Crear registro en tabla alumnos
    const { data: alumno, error: alumnoError } = await supabase
      .from('alumnos')
      .insert({
        id: authData.user.id,
        nombre: alumnoData.nombre,
        nivel_educativo: alumnoData.nivel_educativo,
        puntos_acumulados: 0 // Valor inicial según tu BD
      })
      .select('*, usuario:usuarios(*)')
      .single();

    if (alumnoError) throw alumnoError;

    // 5. Preparar respuesta sin datos sensibles
    const responseData = {
      id: alumno.id,
      nombre: alumno.nombre,
      nivel_educativo: alumno.nivel_educativo,
      puntos_acumulados: alumno.puntos_acumulados,
      usuario: {
        id: alumno.usuario?.id,
        email: alumno.usuario?.email,
        rol: alumno.usuario?.rol,
        avatar_url: alumno.usuario?.avatar_url,
        fecha_registro: alumno.usuario?.fecha_registro
      }
    };

    res.status(201).json(responseData);

  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Error desconocido al crear alumno' });
    }
  }
};


export const updateAlumno = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: AlumnoUpdate = req.body;

    const { data, error } = await supabase
      .from('alumnos')
      .update(updateData)
      .eq('id', id)
      .select('*, usuario:usuarios(*)')
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: unknown) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
}};

export const deleteAlumno = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Eliminar de la tabla alumnos
    const { error: alumnoError } = await supabase
      .from('alumnos')
      .delete()
      .eq('id', id);

    if (alumnoError) throw alumnoError;

    // Eliminar de la tabla usuarios
    const { error: userError } = await supabase
      .from('usuarios')
      .delete()
      .eq('id', id);

    if (userError) throw userError;

    // Eliminar usuario de Auth
    await supabase.auth.admin.deleteUser(id);

    res.status(204).send();
  } catch (error: unknown) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
}};
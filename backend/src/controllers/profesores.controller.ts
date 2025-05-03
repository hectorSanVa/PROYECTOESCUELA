// src/controllers/profesores.controller.ts
import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { Profesor, ProfesorCreate, ProfesorUpdate } from '../models/Profesor';

export const getAllProfesores = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('profesores')
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

export const getProfesorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('profesores')
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

export const createProfesor = async (req: Request, res: Response) => {
  try {
    const { usuario, ...profesorData } = req.body as ProfesorCreate;

    // Primero crear el usuario
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: usuario.email,
      password: usuario.password_hash,
    });

    if (authError) throw authError;

    // Crear registro en tabla usuarios
    const { error: userError } = await supabase
      .from('usuarios')
      .insert({
        id: authData.user?.id,
        email: usuario.email,
        password_hash: usuario.password_hash,
        rol: 'profesor',
        avatar_url: usuario.avatar_url,
      });

    if (userError) throw userError;

    // Crear registro en tabla profesores
    const { data: profesor, error: profesorError } = await supabase
      .from('profesores')
      .insert({
        id: authData.user?.id,
        nombre: profesorData.nombre,
        especialidad: profesorData.especialidad,
      })
      .select('*, usuario:usuarios(*)')
      .single();

    if (profesorError) throw profesorError;

    res.status(201).json(profesor);
  } catch (error: unknown) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
}};

export const updateProfesor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: ProfesorUpdate = req.body;

    const { data, error } = await supabase
      .from('profesores')
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

export const deleteProfesor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar si el profesor tiene cursos asignados
    const { data: cursos, error: cursosError } = await supabase
      .from('cursos')
      .select('id')
      .eq('profesor_id', id);

    if (cursosError) throw cursosError;
    if (cursos.length > 0) {
      return res.status(400).json({ error: 'No se puede eliminar, el profesor tiene cursos asignados' });
    }

    // Eliminar de la tabla profesores
    const { error: profesorError } = await supabase
      .from('profesores')
      .delete()
      .eq('id', id);

    if (profesorError) throw profesorError;

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
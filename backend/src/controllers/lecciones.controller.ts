// src/controllers/lecciones.controller.ts
import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { LeccionCreate, LeccionUpdate } from '../models/Leccion';

export const getAllLecciones = async (req: Request, res: Response) => {
  try {
    const { cursoId } = req.query;
    let query = supabase
      .from('lecciones')
      .select('*, curso:cursos(nombre, materia)');

    if (cursoId) {
      query = query.eq('curso_id', cursoId);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (error: unknown) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
}};

export const getLeccionById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('lecciones')
      .select('*, curso:cursos(*, profesor:profesores(*))')
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

export const createLeccion = async (req: Request, res: Response) => {
  try {
    const leccionData: LeccionCreate = req.body;

    // Verificar que el curso existe
    const { error: cursoError } = await supabase
      .from('cursos')
      .select('id')
      .eq('id', leccionData.curso_id)
      .single();

    if (cursoError) throw cursoError;

    const { data, error } = await supabase
      .from('lecciones')
      .insert(leccionData)
      .select('*, curso:cursos(*, profesor:profesores(*))')
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: unknown) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
}};

export const updateLeccion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: LeccionUpdate = req.body;

    const { data, error } = await supabase
      .from('lecciones')
      .update(updateData)
      .eq('id', id)
      .select('*, curso:cursos(*, profesor:profesores(*))')
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

export const deleteLeccion = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar si la lección tiene actividades
    const { data: actividades, error: actividadesError } = await supabase
      .from('actividades')
      .select('id')
      .eq('leccion_id', id);

    if (actividadesError) throw actividadesError;
    if (actividades.length > 0) {
      return res.status(400).json({ error: 'No se puede eliminar, la lección tiene actividades asignadas' });
    }

    const { error } = await supabase
      .from('lecciones')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error: unknown) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
}};

export const getLeccionesByCurso = async (req: Request, res: Response) => {
  try {
    const { cursoId } = req.params;
    const { data, error } = await supabase
      .from('lecciones')
      .select('*')
      .eq('curso_id', cursoId)
      .order('orden', { ascending: true });

    if (error) throw error;
    res.json(data);
  } catch (error: unknown) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
}};
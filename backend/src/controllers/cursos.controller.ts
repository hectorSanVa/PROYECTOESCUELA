// src/controllers/cursos.controller.ts
import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { CursoCreate, CursoUpdate } from '../models/Curso';

export const getAllCursos = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('cursos')
      .select('*, profesor:profesores(nombre, especialidad)');

    if (error) throw error;
    res.json(data);
  } catch (error: unknown) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
}};

export const getCursoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('cursos')
      .select('*, profesor:profesores(*, usuario:usuarios(*))')
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

export const createCurso = async (req: Request, res: Response) => {
  try {
    const cursoData: CursoCreate = req.body;

    const { data, error } = await supabase
      .from('cursos')
      .insert(cursoData)
      .select('*, profesor:profesores(*, usuario:usuarios(*))')
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

export const updateCurso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: CursoUpdate = req.body;

    const { data, error } = await supabase
      .from('cursos')
      .update(updateData)
      .eq('id', id)
      .select('*, profesor:profesores(*, usuario:usuarios(*))')
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

export const deleteCurso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar si el curso tiene lecciones
    const { data: lecciones, error: leccionesError } = await supabase
      .from('lecciones')
      .select('id')
      .eq('curso_id', id);

    if (leccionesError) throw leccionesError;
    if (lecciones.length > 0) {
      return res.status(400).json({ error: 'No se puede eliminar, el curso tiene lecciones asignadas' });
    }

    const { error } = await supabase
      .from('cursos')
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

export const getCursosByProfesor = async (req: Request, res: Response) => {
  try {
    const { profesorId } = req.params;
    const { data, error } = await supabase
      .from('cursos')
      .select('*')
      .eq('profesor_id', profesorId);

    if (error) throw error;
    res.json(data);
  } catch (error: unknown) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
}};
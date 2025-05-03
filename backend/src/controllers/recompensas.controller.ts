// src/controllers/recompensas.controller.ts
import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { RecompensaCreate, RecompensaUpdate } from '../models/Recompensa';

// Función auxiliar para manejar errores
const handleError = (error: unknown, res: Response) => {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
};

export const getAllRecompensas = async (req: Request, res: Response) => {
  try {
    const { alumnoId } = req.query;
    let query = supabase
      .from('recompensas')
      .select('*, alumno:alumnos(*)');

    if (alumnoId) {
      query = query.eq('alumno_id', alumnoId);
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

export const getRecompensaById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('recompensas')
      .select('*, alumno:alumnos(*)')
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

export const createRecompensa = async (req: Request, res: Response) => {
    try {
      const recompensaData: RecompensaCreate = req.body;
  
      // Verificar que el alumno existe
      const { data: alumno, error: alumnoError } = await supabase
        .from('alumnos')
        .select('puntos_acumulados')
        .eq('id', recompensaData.alumno_id)
        .single();
  
      if (alumnoError) throw alumnoError;
      if (!alumno) throw new Error('Alumno no encontrado');
  
      // Si es de tipo puntos_extra, actualizar puntos del alumno
      if (recompensaData.tipo === 'puntos_extra') {
        const { error: updateError } = await supabase
          .from('alumnos')
          .update({ puntos_acumulados: (alumno.puntos_acumulados || 0) + 10 }) // 10 puntos extra
          .eq('id', recompensaData.alumno_id);
  
        if (updateError) throw updateError;
      }
  
      const { data, error } = await supabase
        .from('recompensas')
        .insert(recompensaData)
        .select('*, alumno:alumnos(*)')
        .single();
  
      if (error) throw error;
      res.status(201).json(data);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };

export const updateRecompensa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: RecompensaUpdate = req.body;

    const { data, error } = await supabase
      .from('recompensas')
      .update(updateData)
      .eq('id', id)
      .select('*, alumno:alumnos(*)')
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

export const deleteRecompensa = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('recompensas')
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

export const getRecompensasByAlumno = async (req: Request, res: Response) => {
  try {
    const { alumnoId } = req.params;
    const { data, error } = await supabase
      .from('recompensas')
      .select('*')
      .eq('alumno_id', alumnoId);

    if (error) throw error;
    res.json(data);
  } catch (error: unknown) {
  if (error instanceof Error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
}};
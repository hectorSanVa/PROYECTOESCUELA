// src/controllers/respuestasIA.controller.ts
import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { RespuestaIACreate, RespuestaIAUpdate } from '../models/RespuestaIA';

export const getAllRespuestasIA = async (req: Request, res: Response) => {
  try {
    const { alumnoId, actividadId } = req.query;
    let query = supabase
      .from('respuestas_ia')
      .select('*, alumno:alumnos(*), actividad:actividades(*)');

    if (alumnoId) {
      query = query.eq('alumno_id', alumnoId);
    }
    if (actividadId) {
      query = query.eq('actividad_id', actividadId);
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

export const getRespuestasIAById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('respuestas_ia')
      .select('*, alumno:alumnos(*), actividad:actividades(*)')
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

export const createRespuestasIA = async (req: Request, res: Response) => {
    try {
      const respuestaData: RespuestaIACreate = req.body;
  
      // Verificar que el alumno existe
      const { data: alumno, error: alumnoError } = await supabase
        .from('alumnos')
        .select('id')
        .eq('id', respuestaData.alumno_id)
        .single();
  
      if (alumnoError || !alumno) {
        return res.status(404).json({ error: 'Alumno no encontrado' });
      }
  
      // Verificar que la actividad existe
      const { data: actividad, error: actividadError } = await supabase
        .from('actividades')
        .select('id')
        .eq('id', respuestaData.actividad_id)
        .single();
  
      if (actividadError || !actividad) {
        return res.status(404).json({ error: 'Actividad no encontrada' });
      }
  
      const { data, error } = await supabase
        .from('respuestas_ia')
        .insert({
          ...respuestaData,
          timestamp: new Date().toISOString() // Asegurar el timestamp
        })
        .select('*, alumno:alumnos(*), actividad:actividades(*)')
        .single();
  
      if (error) throw error;
      res.status(201).json(data);
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  };

export const updateRespuestasIA = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: RespuestaIAUpdate = req.body;

    const { data, error } = await supabase
      .from('respuestas_ia')
      .update(updateData)
      .eq('id', id)
      .select('*, alumno:alumnos(*), actividad:actividades(*)')
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

export const deleteRespuestasIA = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('respuestas_ia')
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

export const getRespuestasIAByAlumnoAndActividad = async (req: Request, res: Response) => {
    try {
      const { alumnoId, actividadId } = req.params;
      const { data, error } = await supabase
        .from('respuestas_ia')
        .select('*, alumno:alumnos(*), actividad:actividades(*)')
        .eq('alumno_id', alumnoId)
        .eq('actividad_id', actividadId)
        .single();
  
      if (error) throw error;
      res.json(data || null); // Mejor devolver null que un objeto vacío
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  };
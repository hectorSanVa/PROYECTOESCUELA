// src/controllers/progreso.controller.ts
import { Request, Response } from 'express';
import { supabase } from '../lib/supabase';
import { 
  ProgresoAlumnoCreate, 
  ProgresoAlumnoUpdate,
  ActividadWithPuntos,
  ProgresoWithRelations
} from '../models/ProgresoAlumno';

// Función auxiliar para manejar errores
const handleError = (error: unknown, res: Response) => {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'An unknown error occurred' });
    }
  };

// Función para actualizar puntos del alumno
const updatePuntosAlumno = async (alumnoId: string, puntos: number) => {
    const { data: alumno, error } = await supabase
      .from('alumnos')
      .select('puntos_acumulados')
      .eq('id', alumnoId)
      .single();
  
    if (error) throw error;
    if (!alumno) throw new Error('Alumno no encontrado');
  
    const { error: updateError } = await supabase
      .from('alumnos')
      .update({ puntos_acumulados: (alumno.puntos_acumulados || 0) + puntos })
      .eq('id', alumnoId);
  
    if (updateError) throw updateError;
  };

export const getAllProgresos = async (req: Request, res: Response) => {
  try {
    const { alumnoId, actividadId } = req.query;
    let query = supabase
      .from('progreso_alumno')
      .select('*, alumno:alumnos(*), actividad:actividades(*)');

    if (alumnoId && typeof alumnoId === 'string') {
      query = query.eq('alumno_id', alumnoId);
    }
    if (actividadId && typeof actividadId === 'string') {
      query = query.eq('actividad_id', actividadId);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getProgresoById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('progreso_alumno')
      .select('*, alumno:alumnos(*), actividad:actividades(*)')
      .eq('id', id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const createProgreso = async (req: Request, res: Response) => {
    try {
      const progresoData: ProgresoAlumnoCreate = req.body;
  
      // Verificar que el alumno existe
      const { error: alumnoError } = await supabase
        .from('alumnos')
        .select('id')
        .eq('id', progresoData.alumno_id)
        .single();
      if (alumnoError) throw alumnoError;
  
      // Verificar que la actividad existe y obtener puntos
      const { data: actividad, error: actividadError } = await supabase
        .from('actividades')
        .select('puntos_recompensa')
        .eq('id', progresoData.actividad_id)
        .single<{ puntos_recompensa: number }>();
      
      if (actividadError) throw actividadError;
      if (!actividad) throw new Error('Actividad no encontrada');
  
      // Si está completado, actualizar puntos del alumno
      if (progresoData.completado && actividad.puntos_recompensa) {
        await updatePuntosAlumno(progresoData.alumno_id, actividad.puntos_recompensa);
      }
  
      const { data, error } = await supabase
        .from('progreso_alumno')
        .insert(progresoData)
        .select('*, alumno:alumnos(*), actividad:actividades(*)')
        .single<ProgresoWithRelations>();
  
      if (error) throw error;
      res.status(201).json(data);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };

  export const updateProgreso = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const updateData: ProgresoAlumnoUpdate = req.body;
  
      // Obtener el progreso actual con la relación de actividad
      const { data: progreso, error: progresoError } = await supabase
        .from('progreso_alumno')
        .select('*, actividad:actividades(puntos_recompensa)')
        .eq('id', id)
        .single<{
          alumno_id: string;
          completado: boolean;
          actividad: ActividadWithPuntos;
        }>();
      
      if (progresoError) throw progresoError;
      if (!progreso) throw new Error('Progreso no encontrado');
  
      // Si se está marcando como completado y antes no lo estaba
      if (updateData.completado && !progreso.completado && progreso.actividad) {
        await updatePuntosAlumno(progreso.alumno_id, progreso.actividad.puntos_recompensa);
      }
  
      const { data, error } = await supabase
        .from('progreso_alumno')
        .update(updateData)
        .eq('id', id)
        .select('*, alumno:alumnos(*), actividad:actividades(*)')
        .single<ProgresoWithRelations>();
  
      if (error) throw error;
      res.json(data);
    } catch (error: unknown) {
      handleError(error, res);
    }
  };

export const deleteProgreso = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from('progreso_alumno')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error: unknown) {
    handleError(error, res);
  }
};

export const getProgresoByAlumnoAndActividad = async (req: Request, res: Response) => {
  try {
    const { alumnoId, actividadId } = req.params;
    const { data, error } = await supabase
      .from('progreso_alumno')
      .select('*')
      .eq('alumno_id', alumnoId)
      .eq('actividad_id', actividadId)
      .single();

    if (error) throw error;
    res.json(data || {});
  } catch (error: unknown) {
    handleError(error, res);
  }
};
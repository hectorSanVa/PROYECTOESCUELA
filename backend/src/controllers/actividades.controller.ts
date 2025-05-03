// src/controllers/actividades.controller.ts
import { Request, Response } from "express";
import { supabase } from "../lib/supabase";
import {
  ActividadCreate,
  ActividadUpdate,
} from "../models/Actividad";

export const getAllActividades = async (req: Request, res: Response) => {
  try {
    const { leccionId } = req.query;
    let query = supabase
      .from("actividades")
      .select("*, leccion:lecciones(titulo, curso_id)");

    if (leccionId) {
      query = query.eq("leccion_id", leccionId);
    }

    const { data, error } = await query;

    if (error) throw error;
    res.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const getActividadById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from("actividades")
      .select("*, leccion:lecciones(*, curso:cursos(*))")
      .eq("id", id)
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const createActividad = async (req: Request, res: Response) => {
  try {
    const actividadData: ActividadCreate = req.body;

    // Verificar que la lección existe si se proporciona leccion_id
    if (actividadData.leccion_id) {
      const { error: leccionError } = await supabase
        .from("lecciones")
        .select("id")
        .eq("id", actividadData.leccion_id)
        .single();

      if (leccionError) throw leccionError;
    }

    const { data, error } = await supabase
      .from("actividades")
      .insert(actividadData)
      .select("*, leccion:lecciones(*, curso:cursos(*))")
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const updateActividad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: ActividadUpdate = req.body;

    const { data, error } = await supabase
      .from("actividades")
      .update(updateData)
      .eq("id", id)
      .select("*, leccion:lecciones(*, curso:cursos(*))")
      .single();

    if (error) throw error;
    res.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const deleteActividad = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar si la actividad tiene progresos registrados
    const { data: progresos, error: progresosError } = await supabase
      .from("progreso_alumno")
      .select("id")
      .eq("actividad_id", id);

    if (progresosError) throw progresosError;
    if (progresos.length > 0) {
      return res
        .status(400)
        .json({
          error:
            "No se puede eliminar, la actividad tiene progresos registrados",
        });
    }

    const { error } = await supabase.from("actividades").delete().eq("id", id);

    if (error) throw error;
    res.status(204).send();
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

export const getActividadesByLeccion = async (req: Request, res: Response) => {
  try {
    const { leccionId } = req.params;
    const { data, error } = await supabase
      .from("actividades")
      .select("*")
      .eq("leccion_id", leccionId);

    if (error) throw error;
    res.json(data);
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: "An unknown error occurred" });
    }
  }
};

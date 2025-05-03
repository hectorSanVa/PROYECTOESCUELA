// src/routes/progreso.routes.ts
import { Router } from 'express';
import { 
  getAllProgresos, 
  getProgresoById, 
  createProgreso, 
  updateProgreso, 
  deleteProgreso,
  getProgresoByAlumnoAndActividad 
} from '../controllers/progreso.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getAllProgresos);
router.get('/:id', authenticate, getProgresoById);
router.get('/alumno/:alumnoId/actividad/:actividadId', authenticate, getProgresoByAlumnoAndActividad);
router.post('/', authenticate, createProgreso);
router.put('/:id', authenticate, updateProgreso);
router.delete('/:id', authenticate, deleteProgreso);

export default router;
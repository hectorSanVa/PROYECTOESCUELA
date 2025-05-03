// src/routes/respuestasIA.routes.ts
import { Router } from 'express';
import { 
  getAllRespuestasIA, 
  getRespuestasIAById, 
  createRespuestasIA, 
  updateRespuestasIA, 
  deleteRespuestasIA,
  getRespuestasIAByAlumnoAndActividad 
} from '../controllers/respuestasIA.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getAllRespuestasIA);
router.get('/:id', authenticate, getRespuestasIAById);
router.get('/alumno/:alumnoId/actividad/:actividadId', authenticate, getRespuestasIAByAlumnoAndActividad);
router.post('/', authenticate, createRespuestasIA);
router.put('/:id', authenticate, updateRespuestasIA);
router.delete('/:id', authenticate, deleteRespuestasIA);

export default router;
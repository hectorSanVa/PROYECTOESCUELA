// src/routes/actividades.routes.ts
import { Router } from 'express';
import { 
  getAllActividades, 
  getActividadById, 
  createActividad, 
  updateActividad, 
  deleteActividad,
  getActividadesByLeccion 
} from '../controllers/actividades.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getAllActividades);
router.get('/:id', authenticate, getActividadById);
router.get('/leccion/:leccionId', authenticate, getActividadesByLeccion);
router.post('/', authenticate, authorize(['admin', 'profesor']), createActividad);
router.put('/:id', authenticate, authorize(['admin', 'profesor']), updateActividad);
router.delete('/:id', authenticate, authorize(['admin', 'profesor']), deleteActividad);

export default router;
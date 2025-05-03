// src/routes/lecciones.routes.ts
import { Router } from 'express';
import { 
  getAllLecciones, 
  getLeccionById, 
  createLeccion, 
  updateLeccion, 
  deleteLeccion,
  getLeccionesByCurso 
} from '../controllers/lecciones.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getAllLecciones);
router.get('/:id', authenticate, getLeccionById);
router.get('/curso/:cursoId', authenticate, getLeccionesByCurso);
router.post('/', authenticate, authorize(['admin', 'profesor']), createLeccion);
router.put('/:id', authenticate, authorize(['admin', 'profesor']), updateLeccion);
router.delete('/:id', authenticate, authorize(['admin', 'profesor']), deleteLeccion);

export default router;
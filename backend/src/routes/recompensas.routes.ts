// src/routes/recompensas.routes.ts
import { Router } from 'express';
import { 
  getAllRecompensas, 
  getRecompensaById, 
  createRecompensa, 
  updateRecompensa, 
  deleteRecompensa,
  getRecompensasByAlumno 
} from '../controllers/recompensas.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, authorize(['admin', 'profesor']), getAllRecompensas);
router.get('/:id', authenticate, getRecompensaById);
router.get('/alumno/:alumnoId', authenticate, getRecompensasByAlumno);
router.post('/', authenticate, authorize(['admin', 'profesor']), createRecompensa);
router.put('/:id', authenticate, authorize(['admin', 'profesor']), updateRecompensa);
router.delete('/:id', authenticate, authorize(['admin', 'profesor']), deleteRecompensa);

export default router;
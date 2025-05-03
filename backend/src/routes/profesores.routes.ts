// src/routes/profesores.routes.ts
import { Router } from 'express';
import { 
  getAllProfesores, 
  getProfesorById, 
  createProfesor, 
  updateProfesor, 
  deleteProfesor 
} from '../controllers/profesores.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, authorize(['admin']), getAllProfesores);
router.get('/:id', authenticate, authorize(['admin']), getProfesorById);
router.post('/', authenticate, authorize(['admin']), createProfesor);
router.put('/:id', authenticate, authorize(['admin']), updateProfesor);
router.delete('/:id', authenticate, authorize(['admin']), deleteProfesor);

export default router;
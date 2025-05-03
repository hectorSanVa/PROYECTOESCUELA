// src/routes/alumnos.routes.ts
import { Router } from 'express';
import { 
  getAllAlumnos, 
  getAlumnoById, 
  createAlumno, 
  updateAlumno, 
  deleteAlumno 
} from '../controllers/alumnos.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, authorize(['admin', 'profesor']), getAllAlumnos);
router.get('/:id', authenticate, authorize(['admin', 'profesor']), getAlumnoById);
router.post('/', authenticate, authorize(['admin']), createAlumno);
router.put('/:id', authenticate, authorize(['admin']), updateAlumno);
router.delete('/:id', authenticate, authorize(['admin']), deleteAlumno);

export default router;
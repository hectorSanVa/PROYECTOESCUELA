// src/routes/cursos.routes.ts
import { Router } from 'express';
import { 
  getAllCursos, 
  getCursoById, 
  createCurso, 
  updateCurso, 
  deleteCurso,
  getCursosByProfesor 
} from '../controllers/cursos.controller';
import { authenticate, authorize } from '../middlewares/auth.middleware';

const router = Router();

router.get('/', authenticate, getAllCursos);
router.get('/:id', authenticate, getCursoById);
router.get('/profesor/:profesorId', authenticate, getCursosByProfesor);
router.post('/', authenticate, authorize(['admin', 'profesor']), createCurso);
router.put('/:id', authenticate, authorize(['admin', 'profesor']), updateCurso);
router.delete('/:id', authenticate, authorize(['admin', 'profesor']), deleteCurso);

export default router;
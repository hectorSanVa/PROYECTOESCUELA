import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import authRoutes from './routes/auth.routes';
import alumnosRoutes from './routes/alumnos.routes';
import profesoresRoutes from './routes/profesores.routes';
import cursosRoutes from './routes/cursos.routes';
import leccionesRoutes from './routes/lecciones.routes';
import actividadesRoutes from './routes/actividades.routes';
import progresoRoutes from './routes/progreso.routes';
import recompensasRoutes from './routes/recompensas.routes';
import respuestasIARoutes from './routes/respuestasIA.routes';
import { errorHandler, notFound } from './middlewares/errorHandler';
import { authenticate, authorize } from './middlewares/auth.middleware';

const app = express();

// 1. Middlewares básicos de seguridad y configuración
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// 2. Rutas públicas (sin autenticación)
app.use('/api/auth', authRoutes);

// 3. Middleware de autenticación global para todas las rutas API
app.use('/api', authenticate);

// 4. Rutas protegidas con autorización específica
app.use('/api/alumnos', authorize(['admin']), alumnosRoutes);
app.use('/api/profesores', authorize(['admin']), profesoresRoutes);
app.use('/api/cursos', authorize(['admin', 'profesor']), cursosRoutes);
app.use('/api/lecciones', authorize(['admin', 'profesor']), leccionesRoutes);
app.use('/api/actividades', authorize(['admin', 'profesor']), actividadesRoutes);
app.use('/api/progreso', authorize(['admin', 'profesor', 'alumno']), progresoRoutes);
app.use('/api/recompensas', authorize(['admin', 'profesor']), recompensasRoutes);
app.use('/api/respuestas-ia', authorize(['admin', 'profesor', 'alumno']), respuestasIARoutes);

// 5. Manejo de errores
app.use(notFound);
app.use(errorHandler);

export default app;
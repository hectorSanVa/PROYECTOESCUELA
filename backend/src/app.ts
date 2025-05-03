// src/app.ts
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

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(morgan('dev'));
app.use(express.json());

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/alumnos', alumnosRoutes);
app.use('/api/profesores', profesoresRoutes);
app.use('/api/cursos', cursosRoutes);
app.use('/api/lecciones', leccionesRoutes);
app.use('/api/actividades', actividadesRoutes);
app.use('/api/progreso', progresoRoutes);
app.use('/api/recompensas', recompensasRoutes);
app.use('/api/respuestas-ia', respuestasIARoutes);

// Manejo de errores
app.use(notFound);
app.use(errorHandler);

export default app;
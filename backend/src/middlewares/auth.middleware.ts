// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({ 
        error: 'No token provided',
        shouldRedirect: false
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Verificación única con Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ 
        error: 'Invalid or expired token',
        shouldRedirect: true
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(500).json({ 
      error: 'Authentication failed',
      shouldRedirect: false
    });
  }
};

export const authorize = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) return res.status(401).json({ error: 'Unauthenticated' });

    try {
      // Obtener usuario con su rol
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('id, rol')
        .eq('id', req.user.id)
        .single();

      if (error || !usuario) throw error || new Error('User not found');

      // Verificar si es profesor y obtener datos adicionales
      if (usuario.rol === 'profesor') {
        const { data: profesor } = await supabase
          .from('profesores')
          .select('id, especialidad')
          .eq('usuario_id', usuario.id)
          .single();

        req.user.profesor = profesor; // Adjunta datos de profesor
      }

      // Verificación de rol
      if (!roles.includes(usuario.rol)) {
        return res.status(403).json({ 
          error: 'Unauthorized role',
          requiredRoles: roles,
          userRole: usuario.rol
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};
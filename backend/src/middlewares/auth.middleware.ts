// src/middlewares/auth.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { supabase } from '../lib/supabase';

declare global {
  namespace Express {
    interface Request {
      user: any;
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
    
    // Verificación con Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return res.status(401).json({ 
        error: 'Invalid or expired token',
        shouldRedirect: true
      });
    }

    // Obtener el rol del usuario
    const { data: usuario, error: userError } = await supabase
      .from('usuarios')
      .select('id, rol')
      .eq('id', user.id)
      .single();

    if (userError || !usuario) {
      return res.status(401).json({ 
        error: 'User not found',
        shouldRedirect: true
      });
    }

    // Adjuntar usuario y rol a la request
    req.user = {
      ...user,
      rol: usuario.rol
    };

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
    try {
      if (!req.user) {
        return res.status(401).json({ error: 'Unauthenticated' });
      }

      // Verificación de rol
      if (!roles.includes(req.user.rol)) {
        console.log('Rol del usuario:', req.user.rol);
        console.log('Roles permitidos:', roles);
        return res.status(403).json({ 
          error: 'Unauthorized role',
          requiredRoles: roles,
          userRole: req.user.rol
        });
      }

      next();
    } catch (error) {
      console.error('Authorization error:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
};
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
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const { data: { user }, error } = await supabase.auth.getUser(token);
    if (error) throw error;

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const authorize = (roles: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { data: usuario, error } = await supabase
        .from('usuarios')
        .select('rol')
        .eq('id', req.user.id)
        .single();

      if (error) throw error;
      if (!roles.includes(usuario.rol)) {
        return res.status(403).json({ error: 'Unauthorized' });
      }

      next();
    } catch (error: unknown) {
        if (error instanceof Error) {
          res.status(500).json({ error: error.message });
        } else {
          res.status(500).json({ error: 'An unknown error occurred' });
        }
      }
  };
};
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error('Error handler:', err);
  
  // Manejo de errores conocidos
  if (err instanceof Error) {
    return res.status(500).json({ 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }

  // Errores desconocidos
  res.status(500).json({ 
    error: 'An unknown error occurred',
    shouldRedirect: false
  });
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    path: req.path,
    method: req.method
  });
};
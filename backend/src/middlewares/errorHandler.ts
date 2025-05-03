import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: unknown, req: Request, res: Response, next: NextFunction) => {
  console.error(err);
  
  if (err instanceof Error) {
    res.status(500).json({ error: err.message });
  } else {
    res.status(500).json({ error: 'An unknown error occurred' });
  }
};

export const notFound = (req: Request, res: Response, next: NextFunction) => {
  res.status(404).json({ error: 'Not found' });
};
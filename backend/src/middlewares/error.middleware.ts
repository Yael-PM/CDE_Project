import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

type HttpError = Error & {
  status?: number;
  statusCode?: number;
};

export const notFoundHandler = (req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.originalUrl
  });
};

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.error('Global error:', error);

  if (res.headersSent) {
    return next(error);
  }

  if (error instanceof multer.MulterError) {
    const statusCode = error.code === 'LIMIT_FILE_SIZE' ? 413 : 400;
    return res.status(statusCode).json({
      success: false,
      message: error.code === 'LIMIT_FILE_SIZE'
        ? 'La imagen excede el límite de 5 MB'
        : 'No se pudo procesar el archivo'
    });
  }

  const normalizedError = error instanceof Error
    ? error as HttpError
    : new Error('Error interno del servidor') as HttpError;
  const statusCode = normalizedError.statusCode || normalizedError.status || 500;
  const publicMessage = statusCode >= 500
    ? 'Error interno del servidor'
    : normalizedError.message;

  return res.status(statusCode).json({
    success: false,
    message: publicMessage
  });
};

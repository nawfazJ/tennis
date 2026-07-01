import type { NextFunction, Request, Response } from 'express';
import type { Logger } from '../../logger/logger.port';

const errorHandler =
  (logger: Logger) => (err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    logger.error('Unhandled error', { err });
    res.status(500).json({ error: 'InternalServerError' });
  };

export { errorHandler };

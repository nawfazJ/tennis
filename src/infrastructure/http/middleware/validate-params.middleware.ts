import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';

const validateParams = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  const parsed = schema.safeParse(req.params);

  if (!parsed.success) {
    res.status(400).json({ error: 'InvalidRequestParams', details: parsed.error.issues });
    return;
  }

  next();
};

export { validateParams };

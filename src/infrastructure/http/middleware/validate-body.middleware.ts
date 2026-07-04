import type { Request, Response, NextFunction } from 'express';
import type { ZodType } from 'zod';

const validateBody = (schema: ZodType) => (req: Request, res: Response, next: NextFunction) => {
  const parsed = schema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: 'InvalidRequestBody', details: parsed.error.issues });
    return;
  }

  req.body = parsed.data;
  next();
};

export { validateBody };

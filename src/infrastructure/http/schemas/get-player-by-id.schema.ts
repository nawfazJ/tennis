import { z } from 'zod';

const getPlayerByIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export { getPlayerByIdParamsSchema };

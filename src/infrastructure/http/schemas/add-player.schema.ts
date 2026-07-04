import { z } from 'zod';

const addPlayerSchema = z.object({
  firstname: z.string().min(1),
  lastname: z.string().min(1),
  shortname: z.string().min(1),
  sex: z.enum(['M', 'F']),
  countryCode: z.string().min(1),
  countryPicture: z.string(),
  picture: z.string(),
  rank: z.number(),
  points: z.number(),
  weight: z.number(),
  height: z.number(),
  age: z.number(),
  last: z.array(z.union([z.literal(0), z.literal(1)])),
});

type AddPlayerSchema = z.infer<typeof addPlayerSchema>;

export { addPlayerSchema };
export type { AddPlayerSchema };

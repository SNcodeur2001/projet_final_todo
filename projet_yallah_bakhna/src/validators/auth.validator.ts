import { z } from 'zod';

export const mnLoginSchema = z.object({
  login: z.string().min(3),
  password: z.string().min(6),
});

export const mnCreateUserSchema = z.object({
  nom: z.string().min(2),
  prenom: z.string().min(2),
  login: z.string().min(3),
  password: z.string().min(6),
  role: z.enum(['ADMIN', 'USER']).optional(),
});

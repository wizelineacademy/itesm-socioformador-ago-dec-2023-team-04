import z from 'zod';
import {boolean} from '@/lib/schemas/utils.ts';

export const userInitSchema = z.object({
	givenName: z.string(),
	familyName: z.string(),
	email: z.string().email('Ingresa un correo válido'),
	password: z.string(),
	admin: boolean,
});

export type UserInit = z.infer<typeof userInitSchema>;

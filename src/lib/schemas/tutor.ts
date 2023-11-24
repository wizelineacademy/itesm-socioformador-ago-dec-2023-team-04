import z from 'zod';
import {json} from '@/lib/schemas/utils.ts';

export const tutorSchema = z.object({
	givenName: z.string(),
	familyName: z.string(),
	phoneNumber: z.string(),
	email: z.string().email('Ingresa un correo válido'),
	students: json(z.array(z.number())),
});

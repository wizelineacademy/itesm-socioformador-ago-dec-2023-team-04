import z from 'zod';
import {json} from '@/lib/schemas/utils.ts';

export const tutorInitSchema = z.object({
	givenName: z.string(),
	familyName: z.string(),
	phoneNumber: z.string(),
	email: z.string().email('Ingresa un correo válido'),
	students: json(z.array(z.number())),
});

export type TutorInit = z.infer<typeof tutorInitSchema>;

import z from 'zod';
import {json} from '@/lib/schemas/utils.ts';

export const studentInitSchema = z.object({
	registration: z.string(),
	givenName: z.string(),
	familyName: z.string(),
	biometricData: json(z.array(z.number()).min(1, 'Los datos biometricos son requeridos')),
});

export type StudentInit = z.infer<typeof studentInitSchema>;

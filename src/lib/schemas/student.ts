import z from 'zod';
import {emptyStringToNull, phoneSchema} from '@/lib/schemas/util.ts';

const stringParameters = {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	invalid_type_error: 'Ingresa un valor',
};

export const studentRegistrationSchema = z.object({
	registration: z.preprocess(emptyStringToNull, z.string(stringParameters)),
	givenName: z.preprocess(emptyStringToNull, z.string(stringParameters)),
	familyName: z.preprocess(emptyStringToNull, z.string(stringParameters)),
	biometricData: z.array(z.number()).min(1, 'Los datos biometricos son requeridos'),
});

export type StudentRegistration = z.infer<typeof studentRegistrationSchema>;

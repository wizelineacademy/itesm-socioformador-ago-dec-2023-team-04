import z from 'zod';
import {emptyStringToNull} from '@/lib/schemas/util.ts';

const stringParameters = {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	invalid_type_error: 'Ingresa un valor',
};

export const studentRegistrationSchema = z.object({
	registration: z.preprocess(emptyStringToNull, z.string(stringParameters)),
	givenName: z.preprocess(emptyStringToNull, z.string(stringParameters)),
	familyName: z.preprocess(emptyStringToNull, z.string(stringParameters)),
	tutorGivenName: z.preprocess(emptyStringToNull, z.string(stringParameters)),
	tutorFamilyName: z.preprocess(emptyStringToNull, z.string(stringParameters)),
	tutorEmail: z.preprocess(emptyStringToNull, z.string(stringParameters).email('Ingresa un correo válido')),
	tutorPhone: z.preprocess(emptyStringToNull, z
		.string(stringParameters)
		.regex(/\+?[()+\d ]+(x\d+)?/g, 'Ingresa un numero valido')
		.transform(value => value.replaceAll(/[^+\dx]/g, ''))),
});

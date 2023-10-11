import z from 'zod';
import {emptyStringToNull} from '@/lib/schemas/util.ts';

const stringParameters = {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	invalid_type_error: 'Ingresa un valor',
};

export const userRegistrationSchema = z.object({
	givenName: z.preprocess(emptyStringToNull, z.string(stringParameters)),
	familyName: z.preprocess(emptyStringToNull, z.string(stringParameters)),
	email: z.preprocess(emptyStringToNull, z.string(stringParameters).email('Ingresa un correo válido')),
	password: z.preprocess(emptyStringToNull, z.string(stringParameters)),
	passwordConfirmation: z.preprocess(emptyStringToNull, z.string(stringParameters)),
	admin: z.coerce.boolean(),
}).refine(data => data.password === data.passwordConfirmation, {
	message: 'Las contraseñas no coinciden',
	path: ['passwordConfirmation'],
});

import z from 'zod';
import {emptyStringToNullSchema} from '@/lib/schemas/util.ts';

const stringParameters = {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	invalid_type_error: 'Ingresa un valor',
};
export const userRegistrationSchema = z.object({
	givenName: emptyStringToNullSchema.pipe(z.string(stringParameters)),
	familyName: emptyStringToNullSchema.pipe(z.string(stringParameters)),
	email: emptyStringToNullSchema.pipe(z.string().email('Ingresa un correo válido')),
	password: emptyStringToNullSchema.pipe(z.string(stringParameters)),
	passwordConfirmation: emptyStringToNullSchema.pipe(z.string(stringParameters)),
	admin: z.coerce.boolean(),
}).refine(data => data.password === data.passwordConfirmation, {
	message: 'Las contraseñas no coinciden',
	path: ['passwordConfirmation'],
});

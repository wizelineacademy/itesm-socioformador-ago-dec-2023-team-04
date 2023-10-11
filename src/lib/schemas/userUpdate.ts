import z from 'zod';
import {emptyStringToUndifined} from '@/lib/schemas/util.ts';

const stringParameters = {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	invalid_type_error: 'Ingresa un valor',
};

export const userUpdateSchema = z.object({
	givenName: z.preprocess(emptyStringToUndifined, z.string(stringParameters).optional()),
	familyName: z.preprocess(emptyStringToUndifined, z.string(stringParameters).optional()),
	email: z.preprocess(emptyStringToUndifined, z.string(stringParameters).email('Ingresa un correo válido').optional()),
	password: z.preprocess(emptyStringToUndifined, z.string(stringParameters).optional()),
	passwordConfirmation: z.preprocess(emptyStringToUndifined, z.string(stringParameters).optional()),
	admin: z.coerce.boolean().optional(),
}).refine(data => data.password === data.passwordConfirmation, {
	message: 'Las contraseñas no coinciden',
	path: ['passwordConfirmation'],
});

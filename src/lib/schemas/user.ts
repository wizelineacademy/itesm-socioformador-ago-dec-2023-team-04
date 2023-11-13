import z from 'zod';

export const userSchema = z.object({
	givenName: z.string(),
	familyName: z.string(),
	email: z.string().email('Ingresa un correo válido'),
	password: z.string(),
	admin: z.coerce.boolean(),
});

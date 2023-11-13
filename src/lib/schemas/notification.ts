import z from 'zod';
// Import {emptyStringToNull} from '@/lib/schemas/util.ts';

const stringParameters = {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	invalid_type_error: 'Ingresa un valor',
};

export const notificationCreationSchema = z.object({
	// Message: z.preprocess(emptyStringToNull, z.string(stringParameters)),
	id: z.coerce.number().optional(),
});

export type NotificationCreation = z.infer<typeof notificationCreationSchema>;

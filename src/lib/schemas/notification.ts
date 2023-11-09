import z from 'zod';
import {emptyStringToNull} from '@/lib/schemas/util.ts';

const stringParameters = {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	invalid_type_error: 'Ingresa un valor',
};

export const notificationCreationSchema = z.object({
	message: z.preprocess(emptyStringToNull, z.string(stringParameters)),
	id: z.preprocess(emptyStringToNull, z.number(stringParameters)),
});

export type NotificationCreation = z.infer<typeof notificationCreationSchema>;

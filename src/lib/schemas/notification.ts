import z from 'zod';

export const notificationInit = z.object({
	tutorId: z.coerce.number(),
	studentId: z.coerce.number(),
	message: z.string(),
});

export type NotificationInit = z.infer<typeof notificationInit>;


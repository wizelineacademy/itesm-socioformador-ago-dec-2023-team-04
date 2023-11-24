import z from 'zod';

export const notificationSchema = z.object({
	tutorId: z.coerce.number(),
	studentId: z.coerce.number(),
	message: z.string(),
});


import {expect, test} from '@jest/globals';
import { notificationSchema } from '@/lib/schemas/notification.ts';


describe('notificationSchema', () => {
	test('should validate a valid notification object', () => {
		const validNotification = {
			tutorId: 1,
			studentId: 2,
			message: 'Valid message',
		};

		const validationResult = notificationSchema.safeParse(validNotification);

		expect(validationResult.success).toBe(true);
	});

	test('should not validate an invalid notification object', () => {
		// Invalid notification object (missing required fields)
		const invalidNotification = {
			tutorId: 1,
			// studentId is missing
			message: 'Invalid message',
		};

		const validationResult = notificationSchema.safeParse(invalidNotification);

		expect(validationResult.success).toBe(false);
		// @ts-ignore
		expect(validationResult.error.errors.length).toBeGreaterThan(0);
	});

});

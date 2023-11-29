import {expect, test} from '@jest/globals';
import { tutorSchema } from '@/lib/schemas/tutor.ts';

describe('Tutor Schema Validation', () => {
	test('should validate a valid tutor object', () => {
		const validTutor = {
			givenName: 'Andy',
			familyName: 'Garza',
			phoneNumber: '1234567890',
			email: 'Andy@gmail.com',
			students: JSON.stringify([1, 2, 3]),
		};

		const validationResult = tutorSchema.safeParse(validTutor);
		expect(validationResult.success).toBe(true);
	});

	test('should invalidate an invalid tutor object', () => {
		const invalidTutor = {
			givenName: 'Andy',
			familyName: 'Garza',
			phoneNumber: '1234567890',
			email: 'andygmailcom', // Invalid email
			students: JSON.stringify([1, 'two', 3]), // Invalid student data
		};

		const validationResult = tutorSchema.safeParse(invalidTutor);
		expect(validationResult.success).toBe(false);
	});
});

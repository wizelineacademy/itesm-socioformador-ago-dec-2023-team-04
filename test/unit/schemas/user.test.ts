import {expect, test} from '@jest/globals';
import { userInitSchema } from '@/lib/schemas/user.ts';

describe('User Initialization Schema Validation', () => {
	test('should validate a valid user initialization object', () => {
		const validUserInit = {
			givenName: 'Andy',
			familyName: 'Garza',
			email: 'Andy@gmail.com',
			password: 'Password123',
			admin: true,
		};

		const validationResult = userInitSchema.safeParse(validUserInit);
		expect(validationResult.success).toBe(true);
	});

	test('should invalidate an invalid user initialization object', () => {
		const invalidUserInit = {
			givenName: 'Andy',
			familyName: 'Garza',
			email: 'andygmailcom', // Invalid email
			password: 'pass', // Too short
			admin: 'yes', // Invalid type
		};

		const validationResult = userInitSchema.safeParse(invalidUserInit);
		expect(validationResult.success).toBe(false);

	});
});

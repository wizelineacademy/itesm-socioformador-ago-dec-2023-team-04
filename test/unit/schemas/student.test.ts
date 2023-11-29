import { studentInitSchema } from '@/lib/schemas/student.ts';
import {expect, test} from '@jest/globals';

describe('studentInitSchema', () => {
	test('should validate a valid student initialization object', () => {
		const validStudentInit = {
			registration: '1234',
			givenName: 'Andy',
			familyName: 'Garza',
			biometricData: [1, 2, 3], // Sample biometric data
		};

		const validationResult = studentInitSchema.safeParse(validStudentInit);

		expect(validationResult.success).toBe(true);
	});

	test('should not validate an invalid student initialization object', () => {
		// Invalid student initialization object (missing required fields)
		const invalidStudentInit = {
			registration: '1234',
		};

		const validationResult = studentInitSchema.safeParse(invalidStudentInit);

		expect(validationResult.success).toBe(false);

		// Check if ZodError is thrown
		if (validationResult.error) {
			// Handle the error message or other properties of the ZodError if needed
			console.error('Validation failed:', validationResult.error.message);
		} else {
			// Handle other cases if necessary
			console.error('Unexpected validation error');
		}
	});

});

import {expect, test} from '@jest/globals';
import {type StudentInit, studentInitSchema} from '@/lib/schemas/student.ts';

describe('studentInitSchema', () => {
	test('should validate a valid student initialization object', () => {
		const validStudentInit: StudentInit = {
			registration: '1234',
			givenName: 'Andy',
			familyName: 'Garza',
			biometricData: [1, 2, 3], // Sample biometric data
			tutors: [1, 2, 3],
		};

		const validationResult = studentInitSchema.safeParse(validStudentInit);

		expect(validationResult.success).toBeTruthy();
	});

	test('should not validate an invalid student initialization object', () => {
		// Invalid student initialization object (missing required fields)
		const invalidStudentInit = {
			registration: '1234',
		};

		const validationResult = studentInitSchema.safeParse(invalidStudentInit);

		expect(validationResult.success).toBeFalsy();
	});
});

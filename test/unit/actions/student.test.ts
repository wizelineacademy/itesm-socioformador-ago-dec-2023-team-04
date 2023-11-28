// student.test.ts
import { upsertStudentAction, deleteStudents } from './student';
import {expect, jest, test} from '@jest/globals';
import prisma from '@/lib/prisma';
import { getUserFromSession } from '@/lib/user';

jest.mock('@/lib/prisma', () => ({
	__esModule: true,
	default: {
		student: {
			create: jest.fn(),
			update: jest.fn(),
			deleteMany: jest.fn(),
		},
		$transaction: jest.fn(),
	},
}));

jest.mock('@/lib/user', () => ({
	getUserFromSession: jest.fn(),
}));

describe('upsertStudentAction', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should return previous state with error message when user is not authorized', async () => {
		const previousState = {
			// Provide necessary previous state data
		};
		const formData = {
			// Provide necessary form data
		};

		// Mock getUserFromSession to return null or non-admin user
		(getUserFromSession as jest.Mock).mockResolvedValueOnce(null);

		const result = await upsertStudentAction(previousState, formData);

		expect(result.formErrors).toContain('No estás autorizado para realizar esta acción');
	});

});

describe('deleteStudents', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('should return success when user is authorized and deletion is successful', async () => {
		// Mock getUserFromSession to return admin user
		(getUserFromSession as jest.Mock).mockResolvedValueOnce({ admin: true });

		// Mock prisma operations as needed
		(prisma.$transaction as jest.Mock).mockImplementationOnce(async (txCallback) => {
			await txCallback({
				studentInGroup: {
					deleteMany: jest.fn(),
				},
				student: {
					deleteMany: jest.fn(),
				},
			});
		});

		const studentIds = [1, 2, 3]; //  student IDs

		const result = await deleteStudents(studentIds);

		expect(result.success).toBe(true);
	});

});


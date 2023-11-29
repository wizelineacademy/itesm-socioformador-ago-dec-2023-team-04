import { getAllStudents} from '@/lib/students.ts';
import {expect, jest, test} from '@jest/globals';

import prisma from '@/lib/prisma.ts';
import { getUserFromSession } from '@/lib/users.ts';
import { AuthenticationError, AuthorizationError } from '@/lib/errors.ts';

jest.mock('@/lib/prisma.ts');
jest.mock('@/lib/users.ts');

describe('getAllStudents', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('debería retornar todos los estudiantes si el usuario es administrador', async () => {
		const mockUser = { id: 1, admin: true };
		(getUserFromSession as jest.Mock).mockResolvedValue(mockUser);

		const mockStudents = [{ id: 1, name: 'Estudiante 1' }, { id: 2, name: 'Estudiante 2' }];
		(prisma.student.findMany as jest.Mock).mockResolvedValue(mockStudents);

		await expect(getAllStudents()).resolves.toEqual(mockStudents);

		expect(getUserFromSession).toHaveBeenCalledTimes(1);
		expect(prisma.student.findMany).toHaveBeenCalledTimes(1);
	});

	test('debería lanzar un error de autorización si el usuario no es administrador', async () => {
		const mockUser = { id: 1, admin: false };
		(getUserFromSession as jest.Mock).mockResolvedValue(mockUser);

		await expect(getAllStudents()).rejects.toThrow(AuthorizationError);

		expect(getUserFromSession).toHaveBeenCalledTimes(1);
		expect(prisma.student.findMany).not.toHaveBeenCalled();
	});

	test('debería lanzar un error de autenticación si no hay usuario en la sesión', async () => {
		(getUserFromSession as jest.Mock).mockResolvedValue(null);

		await expect(getAllStudents()).rejects.toThrow(AuthenticationError);

		expect(getUserFromSession).toHaveBeenCalledTimes(1);
		expect(prisma.student.findMany).not.toHaveBeenCalled();
	});
});

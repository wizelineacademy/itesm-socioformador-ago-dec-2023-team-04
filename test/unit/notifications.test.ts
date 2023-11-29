import {expect, jest, test} from '@jest/globals';
import { createNotification,  deleteNotifications} from '@/lib/notifications.ts';
import { getUserFromSession } from '@/lib/users.ts';
import { getTutorById } from '@/lib/tutors.ts';
import { client } from '@/lib/twilio.ts';
import prisma from '@/lib/prisma.ts';
import { AuthenticationError, AuthorizationError } from '@/lib/errors.ts';

jest.mock('@/lib/users.ts');
jest.mock('@/lib/tutors.ts');
jest.mock('@/lib/twilio.ts');
jest.mock('@/lib/prisma.ts');

describe('createNotification', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('debería crear una notificación correctamente', async () => {
		const mockUser = { id: 1 };
		const mockTutor = { id: 2, phoneNumber: '123456789' };
		const mockNotification = {
			dateCreated: new Date(),
		};

		(getUserFromSession as jest.Mock).mockResolvedValue(mockUser);
		(getTutorById as jest.Mock).mockResolvedValue(mockTutor);
		(client.messages.create as jest.Mock).mockResolvedValue(mockNotification);
		(prisma.tutorNotification.create as jest.Mock).mockResolvedValue({});

		const notificationData = {
			tutorId: 2,
			studentId: 1,
			message: 'Test message',
		};

		await expect(createNotification(notificationData)).resolves.toBeDefined();

		expect(getUserFromSession).toHaveBeenCalledTimes(1);
		expect(getTutorById).toHaveBeenCalledWith(2);
		expect(client.messages.create).toHaveBeenCalledWith({
			body: 'Test message',
			from: '+15005550006',
			to: '123456789',
		});
		expect(prisma.tutorNotification.create).toHaveBeenCalledWith({
			data: {
				studentId: 1,
				tutorId: 2,
				message: 'Test message',
				sentTime: mockNotification.dateCreated,
			},
		});
	});

	test('debería lanzar un error si el usuario no está autenticado', async () => {
		(getUserFromSession as jest.Mock).mockResolvedValue(null);

		const notificationData = {
			tutorId: 2,
			studentId: 1,
			message: 'Test message',
		};

		await expect(createNotification(notificationData)).rejects.toThrow(AuthenticationError);

		expect(getUserFromSession).toHaveBeenCalledTimes(1);
		expect(getTutorById).not.toHaveBeenCalled();
		expect(client.messages.create).not.toHaveBeenCalled();
		expect(prisma.tutorNotification.create).not.toHaveBeenCalled();
	});
});

describe('deleteNotifications', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	test('debería eliminar las notificaciones correctamente', async () => {
		const mockUser = { id: 1, admin: true };
		(getUserFromSession as jest.Mock).mockResolvedValue(mockUser);
		(prisma.tutorNotification.deleteMany as jest.Mock).mockResolvedValue({ count: 3 });

		const deletedCount = await deleteNotifications([1, 2, 3]);

		expect(getUserFromSession).toHaveBeenCalledTimes(1);
		expect(prisma.tutorNotification.deleteMany).toHaveBeenCalledWith({
			where: { id: { in: [1, 2, 3] } },
		});
		expect(deletedCount).toBe(3);
	});

	test('debería lanzar un error de autorización si el usuario no es administrador', async () => {
		const mockUser = { id: 1, admin: false };
		(getUserFromSession as jest.Mock).mockResolvedValue(mockUser);

		await expect(deleteNotifications([1, 2, 3])).rejects.toThrow(AuthorizationError);

		expect(getUserFromSession).toHaveBeenCalledTimes(1);
		expect(prisma.tutorNotification.deleteMany).not.toHaveBeenCalled();
	});

	test('debería lanzar un error si el usuario no está autenticado', async () => {
		(getUserFromSession as jest.Mock).mockResolvedValue(null);

		await expect(deleteNotifications([1, 2, 3])).rejects.toThrow(AuthenticationError);

		expect(getUserFromSession).toHaveBeenCalledTimes(1);
		expect(prisma.tutorNotification.deleteMany).not.toHaveBeenCalled();
	});
});

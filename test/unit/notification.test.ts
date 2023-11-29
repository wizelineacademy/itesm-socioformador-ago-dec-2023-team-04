import {expect, jest, test} from '@jest/globals';
import { getAllNotifications, getNotificationById } from '@/lib/notification.ts';
import prisma from '@/lib/prisma.ts';

jest.mock('@/lib/prisma.ts', () => ({
	tutorNotification: {
		findMany: jest.fn(),
		findUnique: jest.fn(),
	},
}));

describe('getAllNotifications', () => {
	test('debería llamar a prisma.tutorNotification.findMany una vez', async () => {
		await getAllNotifications();

		expect(prisma.tutorNotification.findMany).toHaveBeenCalledTimes(1);
		expect(prisma.tutorNotification.findMany).toHaveBeenCalledWith({
			include: {
				tutor: true,
				student: true,
			},
		});
	});
});

describe('getNotificationById', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	test('debería llamar a prisma.tutorNotification.findUnique con el ID proporcionado', async () => {
		const notificationId = 123;

		await getNotificationById(notificationId);

		expect(prisma.tutorNotification.findUnique).toHaveBeenCalledTimes(1);
		expect(prisma.tutorNotification.findUnique).toHaveBeenCalledWith({
			where: {
				id: notificationId,
			},
		});
	});
});

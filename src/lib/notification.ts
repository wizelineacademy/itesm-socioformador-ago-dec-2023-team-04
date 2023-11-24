import {cache} from 'react';
import prisma from '@/lib/prisma.ts';

export async function getAllNotifications() {
	return prisma.tutorNotification.findMany({
		include: {
			tutor: true,
			student: true,
		},
	});
}

export const getNotificationById = cache(async (id: number) => prisma.tutorNotification.findUnique({
	where: {
		id,
	},
}));

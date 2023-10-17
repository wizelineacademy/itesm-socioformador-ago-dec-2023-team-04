import {cache} from 'react';
import prisma from '@/lib/prisma.ts';

export async function getAllNotifications() {
	return prisma.tutorNotification.findMany({/* {
		select: {
			id: true,
			student: {
				select: {
					familyName: true,
				},
			},
			tutor: {
				select: {
					givenName: true,
					familyName: true,
				},
			},
			sentTime: true,
		},
	} */});
}

export const getNotification = cache(async (id: number) => prisma.tutorNotification.findUnique({
	where: {
		id,
	},
}));

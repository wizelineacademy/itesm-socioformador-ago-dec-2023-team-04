import {cache} from 'react';
import {client} from '@/lib/twilio.ts';
import {type NotificationInit} from '@/lib/schemas/notification.ts';
import prisma from '@/lib/prisma.ts';
import {getTutorById} from '@/lib/tutors.ts';
import {getUserFromSession} from '@/lib/users.ts';
import {AuthenticationError, AuthorizationError} from '@/lib/errors.ts';

/**
 * Creates a notification for a tutor.
 *
 * @param {NotificationInit} data - The data required to create the notification.
 * @returns {Promise<TutorNotification>} - The created tutor notification.
 * @throws {AuthenticationError} - If the user is not authenticated.
 * @throws {Error} - If the tutor is not found.
 */
export async function createNotification(data: NotificationInit) {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	// A user can only get a tutor if they're an users, or the tutor has a student in a group of the user
	const tutor = await getTutorById(data.tutorId);

	if (tutor === null) {
		throw new Error('Tutor desconocido');
	}

	const notification = await client.messages.create({
		body: data.message,
		// From: '+16157459905',
		from: '+15005550006',
		to: tutor.phoneNumber,
	});

	return prisma.tutorNotification.create({
		data: {
			studentId: data.studentId,
			tutorId: data.tutorId,
			message: data.message,
			sentTime: notification.dateCreated,
		},
	});
}

/**
 * Deletes the notifications with the given notification IDs.
 *
 * @param {number[]} notificationIds - The IDs of the notifications to delete.
 * @returns {Promise<number>} - The number of notifications deleted.
 * @throws {AuthenticationError} - If the user is not authenticated.
 * @throws {AuthorizationError} - If the user is not authorized.
 */
export async function deleteNotifications(notificationIds: number[]): Promise<number> {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	if (!user.admin) {
		throw new AuthorizationError();
	}

	const {count} = await prisma.tutorNotification.deleteMany({
		where: {
			id: {
				in: notificationIds,
			},
		},
	});
	return count;
}

export async function getAllNotificationsWithStudentsAndTutors() {
	return prisma.tutorNotification.findMany({
		include: {
			tutor: true,
			student: true,
		},
	});
}

export type NotificationsWithStudentsAndTutors = Awaited<ReturnType<typeof getAllNotifications>>;

export const getNotificationById = cache(async (id: number) => prisma.tutorNotification.findUnique({
	where: {
		id,
	},
}));


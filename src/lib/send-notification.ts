'use server';
import {cache} from 'react';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {notificationInit, type NotificationInit} from '@/lib/schemas/notification.ts';
import prisma from '@/lib/prisma.ts';
import {getUserFromSession} from '@/lib/users.ts';
import {AuthenticationError, AuthorizationError} from '@/lib/errors.ts';
import {type FormState} from '@/components/form.tsx';
import {decodeForm} from '@/lib/schemas/utils.ts';
import {createNotification} from '@/lib/notifications.ts';
import {handleActionError} from '@/lib/action-utils.ts';

export const createNotificationAction = async (state: FormState<Partial<NotificationInit>>, data: FormData): Promise<FormState<Partial<NotificationInit>>> => {
	let notificationId: number;
	try {
		const parsedData = await decodeForm(data, notificationInit);
		const notification = await createNotification(parsedData);
		notificationId = notification.id;
	} catch (error) {
		return handleActionError(state, error);
	}

	revalidatePath('/notifications');
};

export const getStudentById = cache(async (id: number) => {
	const user = await getUserFromSession();

	if (!user) {
		throw new AuthenticationError();
	}

	return prisma.student.findUnique({
		where: {
			id,
			groups: user.admin
				? undefined
				: {
					some: {
						group: {
							users: {
								some: {
									id: user.id,
								},
							},
						},
					},
				},
		},
		include: {
			tutors: true,
		},
	});
});

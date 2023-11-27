'use server';
import {type TutorNotification} from '@prisma/client';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {client} from '@/lib/twilio.ts';
import {notificationSchema} from '@/lib/schemas/notification.ts';
import prisma from '@/lib/prisma.ts';
import {type FormState} from '@/components/form.tsx';
import {decodeForm} from '@/lib/schemas/utils.ts';
import {handleErrorAction} from '@/lib/actions/util.ts';
import {getTutorById} from '@/lib/actions/tutor.ts';
import {type ServerActionResult} from '@/lib/server-action-result.ts';

export async function createNotificationAction(previousState: FormState<TutorNotification>, formData: FormData): Promise<FormState<TutorNotification>> {
	let newId: number | undefined;
	try {
		const validatedNotification = await decodeForm(formData, notificationSchema);
		const tutor = await getTutorById(validatedNotification.tutorId);

		if (tutor === null) {
			return {
				...previousState,
				formErrors: ['Unknown tutor'],
			};
		}

		const notification = await client.messages.create({
			body: validatedNotification.message,
			// From: '+16157459905',
			from: '+15005550006',
			to: tutor.phoneNumber,
		});

		const result = await prisma.tutorNotification.create({
			data: {
				studentId: validatedNotification.studentId,
				tutorId: validatedNotification.tutorId,
				message: validatedNotification.message,
				sentTime: notification.dateCreated,
			},
		});
		newId = result.id;

		revalidatePath('/notifications');
	} catch (error) {
		return handleErrorAction(previousState, error);
	}

	if (newId) {
		redirect('/notifications');
	}

	return {
		...previousState,
		id: newId,
		formErrors: [],
		fieldErrors: {},
	};
}

export async function deleteNotifications(notificationIds: number[]): Promise<ServerActionResult> {
	try {
		await prisma.tutorNotification.deleteMany({
			where: {
				id: {
					in: notificationIds,
				},
			},
		});

		revalidatePath('/notifications');

		return {
			success: true,
		};
	} catch (error) {
		if (error instanceof Error) {
			return {
				success: false,
				name: error.name,
				message: error.message,
			};
		}

		return {
			success: false,
			message: 'unknown server error',
		};
	}
}


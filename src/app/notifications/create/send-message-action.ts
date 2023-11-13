'use server';
import {type Student, type Tutor} from '@prisma/client';
import {client} from '@/lib/twilio.ts';
import {type NotificationCreation, notificationCreationSchema} from '@/lib/schemas/notification.ts';
import {type ServerActionResult} from '@/lib/server-action-result.ts';
import prisma from '@/lib/prisma.ts';
import createNotification from '@/app/notifications/create/create-notification-action.ts';

export default async function sendMessage(notificationCreation: NotificationCreation, student: Student, tutor: Tutor): Promise<ServerActionResult<number>> {
	try {
		console.log(tutor);

		const validatedMessage = notificationCreationSchema.parse(notificationCreation);

		const notificacion = await client.messages.create({
			body: validatedMessage.message,
			// From: '+16157459905',
			from: '+15005550006',
			to: tutor.phoneNumber,
		});

		console.log(notificacion.dateCreated);
		const fecha = new Date(notificacion.dateCreated.toLocaleString('es-MX', {timeZone: 'America/Matamoros'}));
		console.log(fecha);

		const notification = await prisma.tutorNotification.create({
			data: {
				studentId: student.id,
				tutorId: tutor.id,
				message: validatedMessage.message,
				sentTime: fecha,
			},
		});
		return {
			success: true,
			data: notification.id,
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


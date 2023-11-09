'use server';
import {Buffer} from 'node:buffer';
import {type Student, type Tutor} from '@prisma/client';
import {type ServerActionResult} from '@/lib/server-action-result.ts';
import prisma from '@/lib/prisma.ts';

export default async function createNotification(student: Student, tutors: Tutor[]) {
	try {
		const notification = await prisma.tutorNotification.create({
			data: {
				studentId: student.id,
				tutorId: tutors[0].id,
				message: validatedM,
				sentTime: mensaje.sentTime,
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

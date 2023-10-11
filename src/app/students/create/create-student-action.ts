'use server';
import {type ServerActionResult} from '@/lib/server-action-result.ts';
import {decodeForm} from '@/lib/schemas/util.ts';
import {studentRegistrationSchema} from '@/lib/schemas/student.ts';
import prisma from '@/lib/prisma.ts';

export default async function createStudent(formData: FormData): Promise<ServerActionResult<number>> {
	try {
		const registrationData = await decodeForm(formData, studentRegistrationSchema);

		const tutor = await prisma.tutor.create({
			data: {
				givenName: registrationData.tutorGivenName,
				familyName: registrationData.tutorFamilyName,
				phoneNumber: registrationData.tutorPhone,
				email: registrationData.tutorEmail,
			},
		});
		const student = await prisma.student.create({
			data: {
				registration: registrationData.registration,
				givenName: registrationData.givenName,
				familyName: registrationData.familyName,
				biometricData: Buffer(8),
			},
		});
		return {
			success: true,
			data: student.id,
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

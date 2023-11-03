'use server';
import {Buffer} from 'node:buffer';
import {type ServerActionResult} from '@/lib/server-action-result.ts';
import {type StudentRegistration, studentRegistrationSchema} from '@/lib/schemas/student.ts';
import prisma from '@/lib/prisma.ts';

export default async function createStudent(studentRegistration: StudentRegistration): Promise<ServerActionResult<number>> {
	try {
		const validatedStudent = studentRegistrationSchema.parse(studentRegistration);

		const biometricData = new Float64Array(validatedStudent.biometricData);

		const student = await prisma.student.create({
			data: {
				registration: validatedStudent.registration,
				givenName: validatedStudent.givenName,
				familyName: validatedStudent.familyName,
				biometricData: Buffer.from(biometricData.buffer),
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

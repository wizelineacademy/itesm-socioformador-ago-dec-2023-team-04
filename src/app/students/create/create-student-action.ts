'use server';
import z from 'zod';
import {type ServerActionResult} from '@/lib/server-action-result.ts';
import prisma from '@/lib/prisma.ts';
import {emptyStringToNull} from '@/lib/schemas/util.ts';

const stringParameters = {
	// eslint-disable-next-line @typescript-eslint/naming-convention
	invalid_type_error: 'Ingresa un valor',
};
export const studentCreationSchema = z.object({
	registration: z.preprocess(emptyStringToNull, z.string(stringParameters)),
	givenName: z.preprocess(emptyStringToNull, z.string(stringParameters)),
	familyName: z.preprocess(emptyStringToNull, z.string(stringParameters)),
	biometricData: z.array(z.number()).min(1, 'Los datos biometricos son requeridos'),
});
export type StudentRegistration = z.infer<typeof studentCreationSchema>;
export default async function createStudent(studentRegistration: StudentRegistration): Promise<ServerActionResult<number>> {
	try {
		const validatedStudent = studentCreationSchema.parse(studentRegistration);

		const student = await prisma.student.create({
			data: {
				registration: validatedStudent.registration,
				givenName: validatedStudent.givenName,
				familyName: validatedStudent.familyName,
				biometricData: validatedStudent.biometricData,
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

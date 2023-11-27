'use server';
import {revalidatePath} from 'next/cache';
import {type Student} from '@prisma/client';
import {redirect} from 'next/navigation';
import prisma from '@/lib/prisma.ts';
import {handleErrorAction} from '@/lib/actions/util.ts';
import {type FormState} from '@/components/form.tsx';
import {decodeForm} from '@/lib/schemas/utils.ts';
import {studentSchema} from '@/lib/schemas/student.ts';
import {type ServerActionResult} from '@/lib/server-action-result.ts';
import {getUserFromSession} from '@/lib/user.ts';

export async function upsertStudentAction(previousState: FormState<Student>, formData: FormData): Promise<FormState<Student>> {
	let newId: number | undefined;
	const user = await getUserFromSession();

	if (user === null || !user.admin) {
		return	{
			...previousState,
			formErrors: ['No estás autorizado para realizar esta acción'],
		};
	}

	try {
		if (previousState.id === undefined) {
			const validatedStudent = await decodeForm(formData, studentSchema);
			const result = await prisma.student.create({
				data: validatedStudent,
			});
			newId = result.id;
		} else {
			const validatedStudent = await decodeForm(formData, studentSchema.partial());
			await prisma.student.update({
				where: {
					id: previousState.id,
				},
				data: validatedStudent,
			});
		}

		revalidatePath('/student');
	} catch (error) {
		console.log(error);
		return handleErrorAction(previousState, error);
	}

	if (newId) {
		redirect(`/students/${newId}`);
	}

	return {
		...previousState,
		id: newId ?? previousState.id,
		formErrors: [],
		fieldErrors: {},
	};
}

/**
 * Deletes student from the database.
 *
 * @param {number[]} studentIds - An array of student IDs to delete.
 * @return {Promise<ServerActionResult>} A promise that resolves to a ServerActionResult object indicating the result of the delete operation. The promise resolves to an object with a `success` property indicating whether the delete operation was successful. If the delete operation failed, the object may also contain a `name` property with the error name and a `message` property with the error message.
 */
export async function deleteStudents(studentIds: number[]): Promise<ServerActionResult> {
	const user = await getUserFromSession();
	if (user === null || !user.admin) {
		return {
			success: false,
			message: 'No estás autorizado para realizar esta acción',
		};
	}

	try {
		await prisma.$transaction(async tx => {
			await tx.studentInGroup.deleteMany({
				where: {
					studentId: {
						in: studentIds,
					},
				},
			});
			await tx.student.deleteMany({
				where: {
					id: {
						in: studentIds,
					},
				},
			});
		});

		revalidatePath('/student');

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

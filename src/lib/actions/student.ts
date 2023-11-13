'use server';
import {revalidatePath} from 'next/cache';
import {type Group, type Student} from '@prisma/client';
import {redirect} from 'next/navigation';
import prisma from '@/lib/prisma.ts';
import {handleErrorAction} from '@/lib/actions/util.ts';
import {type FormState} from '@/components/form.tsx';
import {decodeForm} from '@/lib/schemas/utils.ts';
import {studentSchema} from '@/lib/schemas/student.ts';

export async function upsertStudentAction(previousState: FormState<Student>, formData: FormData): Promise<FormState<Student>> {
	let newId: number | undefined;
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

		revalidatePath('/students');
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

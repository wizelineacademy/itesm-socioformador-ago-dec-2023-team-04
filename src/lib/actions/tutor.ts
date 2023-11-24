'use server';
import {cache} from 'react';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import prisma from '@/lib/prisma.ts';
import {type ServerActionResult} from '@/lib/server-action-result.ts';
import {type FormState} from '@/components/form.tsx';
import {decodeForm} from '@/lib/schemas/utils.ts';
import {handleErrorAction} from '@/lib/actions/util.ts';
import {tutorSchema} from '@/lib/schemas/tutor.ts';

export async function upsertTutorAction(previousState: FormState<TutorByIdWithStudents>, formData: FormData): Promise<FormState<TutorByIdWithStudents>> {
	let newId: number | undefined;
	try {
		if (previousState.id === undefined) {
			const validatedTutor = await decodeForm(formData, tutorSchema);
			const result = await prisma.tutor.create({
				data: {
					...validatedTutor,
					students: {
						connect: validatedTutor.students?.map(student => ({id: student})),
					},
				},
			});
			newId = result.id;
		} else {
			const validatedTutor = await decodeForm(formData, tutorSchema.partial());
			await prisma.$transaction(async tx => {
				if ('students' in validatedTutor) {
					await tx.tutor.update({
						where: {
							id: previousState.id,
						},
						data: {
							students: {
								set: [],
							},
						},
					});
				}

				await tx.tutor.update({
					where: {
						id: previousState.id,
					},
					data: {
						...validatedTutor,
						students: {
							connect: validatedTutor.students?.map(student => ({id: student})),
						},
					},
				});
			});
		}

		revalidatePath('/tutors');
	} catch (error) {
		console.log(error);
		return handleErrorAction(previousState, error);
	}

	if (newId) {
		redirect(`/tutors/${newId}`);
	}

	return {
		...previousState,
		id: newId ?? previousState.id,
		formErrors: [],
		fieldErrors: {},
	};
}

export const getTutorById = cache(async (id: number) => prisma.tutor.findUnique({
	where: {
		id,
	},
}));

export const getTutorByIdWithStudents = cache(async (id: number) => prisma.tutor.findUnique({
	where: {
		id,
	},
	include: {
		students: true,
	},
}));

export type TutorByIdWithStudents = Awaited<ReturnType<typeof getTutorByIdWithStudents>>;

export const getAllTutors = cache(async () => prisma.tutor.findMany());

export async function deleteTutors(tutorIds: number[]): Promise<ServerActionResult> {
	try {
		await prisma.tutor.deleteMany({
			where: {
				id: {
					in: tutorIds,
				},
			},
		});

		revalidatePath('/tutors');

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

import React from 'react';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import TutorForm from '@/app/tutors/tutor-form.tsx';
import {type TutorInit, tutorInitSchema} from '@/lib/schemas/tutor.ts';
import {type FormState} from '@/components/form.tsx';
import {decodeForm} from '@/lib/schemas/utils.ts';
import {createTutor} from '@/lib/tutors.ts';
import {handleActionError} from '@/lib/action-utils.ts';

export default function Page() {
	const createTutorAction = async (state: FormState<Partial<TutorInit>>, data: FormData): Promise<FormState<Partial<TutorInit>>> => {
		'use server';

		let tutorId: number;

		try {
			const parsedData = await decodeForm(data, tutorInitSchema);
			const tutor = await createTutor(parsedData);
			tutorId = tutor.id;
		} catch (error) {
			return handleActionError(state, error);
		}

		revalidatePath('/tutors');
		redirect(`/tutors/${tutorId}`);
	};

	return (
		<>
			<h1 className='text-lg font-semibold'>Registro de tutor</h1>
			<TutorForm action={createTutorAction}/>
		</>
	);
}

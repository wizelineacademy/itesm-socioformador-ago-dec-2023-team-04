import React from 'react';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {getTutorByIdWithStudents, updateTutor} from '@/lib/tutors.ts';
import TutorForm from '@/app/tutors/tutor-form.tsx';
import {type FormState} from '@/components/form.tsx';
import {type TutorInit, tutorInitSchema} from '@/lib/schemas/tutor.ts';
import {decodeForm} from '@/lib/schemas/utils.ts';
import {handleActionError} from '@/lib/action-utils.ts';

export type EditTutorPageProps = {
	readonly params: {
		readonly tutorId: string;
	};
};

export default async function EditTutorPage(props: EditTutorPageProps) {
	const {params} = props;
	const tutorId = Number.parseInt(params.tutorId, 10);
	const tutor = await getTutorByIdWithStudents(tutorId);
	if (tutor === null) {
		redirect('/tutors');
	}

	const updateTutorAction = async (state: FormState<Partial<TutorInit>>, data: FormData): Promise<FormState<Partial<TutorInit>>> => {
		'use server';

		try {
			const parsedData = await decodeForm(data, tutorInitSchema.partial());
			await updateTutor(tutorId, parsedData);
		} catch (error) {
			return handleActionError(state, error);
		}

		revalidatePath('/tutors');
		return {
			...state,
			success: true,
			formErrors: [],
			fieldErrors: {},
		};
	};

	return (
		<div>
			<div className='flex justify-between w-full'>
				<h1 className='text-2xl'>
					{`${tutor.givenName} ${tutor.familyName}`}
				</h1>
			</div>
			<TutorForm tutor={tutor} action={updateTutorAction}/>
		</div>
	);
}

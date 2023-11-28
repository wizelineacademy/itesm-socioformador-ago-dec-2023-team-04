import React from 'react';
import {revalidatePath} from 'next/cache';
import {deleteTutors, getAllTutors} from '@/lib/tutors.ts';
import TutorClientLayout from '@/app/tutors/tutor-client-layout.tsx';

export default async function StudentsLayout({children}: {children: React.ReactNode}) {
	const tutors = await getAllTutors();
	const deleteTutorsAction = async (tutors: number[]) => {
		'use server';
		await deleteTutors(tutors);
		revalidatePath('/tutors');
	};

	return (
		<TutorClientLayout tutors={tutors} action={deleteTutorsAction}>
			{children}
		</TutorClientLayout>
	);
}

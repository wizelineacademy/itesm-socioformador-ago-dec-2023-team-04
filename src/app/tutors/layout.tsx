import React from 'react';
import {revalidatePath} from 'next/cache';
import {type Metadata} from 'next';
import {deleteTutors, getAllTutors} from '@/lib/tutors.ts';
import TutorClientLayout from '@/app/tutors/tutor-client-layout.tsx';

export const metadata: Metadata = {
	title: 'Tutores | SATS',
	description: 'metaphora. Student Attendance Tracking System',
};

export default async function StudentsLayout({children}: {children: React.ReactNode}) {
	const tutors = await getAllTutors();
	const deleteTutorsAction = async (tutors: number[]) => {
		'use server';
		const count = await deleteTutors(tutors);
		revalidatePath('/tutors');
		return count;
	};

	return (
		<TutorClientLayout tutors={tutors} action={deleteTutorsAction}>
			{children}
		</TutorClientLayout>
	);
}

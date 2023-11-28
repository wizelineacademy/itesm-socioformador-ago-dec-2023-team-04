import React from 'react';
import {getAllTutors} from '@/lib/tutors.ts';
import TutorClientLayout from '@/app/tutors/tutor-client-layout.tsx';

export default async function StudentsLayout({children}: {children: React.ReactNode}) {
	const tutors = await getAllTutors();
	return (
		<TutorClientLayout tutors={tutors}>
			{children}
		</TutorClientLayout>
	);
}

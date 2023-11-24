import React from 'react';
import {withPageAuthRequired} from '@auth0/nextjs-auth0';
import {redirect} from 'next/navigation';
import {getTutorByIdWithStudents} from '@/lib/actions/tutor.ts';
import TutorForm from '@/app/tutors/tutor-form.tsx';

export default withPageAuthRequired(async ({params}: {
	readonly params?: {
		tutorId?: string;
	};
}) => {
	const tutorId = params!.tutorId!;
	const tutor = await getTutorByIdWithStudents(Number.parseInt(tutorId, 10));
	if (tutor === null) {
		redirect('/tutors');
	}

	return (
		<div>
			<div className='flex justify-between w-full'>
				<h1 className='text-2xl'>
					{`${tutor.givenName} ${tutor.familyName}`}
				</h1>
			</div>
			<TutorForm tutor={tutor}/>
		</div>
	);
}, {
	returnTo: '/',
});

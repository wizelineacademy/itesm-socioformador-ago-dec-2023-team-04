import React from 'react';
import {withPageAuthRequired} from '@auth0/nextjs-auth0';
import {notFound} from 'next/navigation';
import {getStudent} from '@/lib/student.ts';
import Icon from '@/components/icon.tsx';
import TutorContactInfo from '@/components/contact-display.tsx';

export default withPageAuthRequired(async ({params}) => {
	const student = await getStudent(Number.parseInt(params.studentId as string, 10));

	if (student === null) {
		notFound();
	}

	return (
		<div>
			<div className='flex justify-between w-full'>
				<h1 className='text-2xl'>
					{`${student.givenName} ${student.familyName}`}
				</h1>
				<Icon name='edit'/>
			</div>
			<div>
				<TutorContactInfo infoId={1}/>
			</div>
		</div>
	);
}, {
	returnTo: '/',
});

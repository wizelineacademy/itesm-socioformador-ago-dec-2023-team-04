import React from 'react';
import {withPageAuthRequired} from '@auth0/nextjs-auth0';
import {notFound} from 'next/navigation';
import {getStudent} from '@/lib/student.ts';

export default withPageAuthRequired(async ({params}) => {
	const student = await getStudent(Number.parseInt(params.studentId as string, 10));

	if (student === null) {
		notFound();
	}

	return (
		<div>
			<h1>
				{`${student.givenName} ${student.familyName}`}
			</h1>
		</div>
	);
}, {
	returnTo: '/',
});

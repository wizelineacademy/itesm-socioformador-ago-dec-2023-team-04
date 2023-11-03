import React from 'react';
import {withPageAuthRequired} from '@auth0/nextjs-auth0';
import {notFound} from 'next/navigation';
import {getStudentById} from '@/lib/student.ts';
import Icon from '@/components/icon.tsx';
import ContactDisplay from '@/components/contact-display.tsx';
import {Button} from '@/components/button.tsx';

export default withPageAuthRequired(async ({params}: {
	readonly params?: {
		studentId?: string;
	};
}) => {
	const studentId = params!.studentId!;
	const student = await getStudentById(Number.parseInt(studentId, 10));
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
			{
				student.tutors.length > 0 && (
					<div>
						{
							student.tutors.map(tutor => (
								<ContactDisplay key={tutor.id} infoId={tutor.id}/>
							))
						}

					</div>
				)
			}
			<h2 className='text-stone-300'>Grupos</h2>
			<h2 className='text-stone-300'>Asistencia en los últimos cinco días</h2>
			<Button size='xl' color='secondary'><Icon name='calendar_month'/>Asistencias</Button>
			<h1>
				{`${student.givenName} ${student.familyName}`}
			</h1>
		</div>
	);
}, {
	returnTo: '/',
});

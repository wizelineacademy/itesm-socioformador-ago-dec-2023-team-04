import React from 'react';
import {withPageAuthRequired} from '@auth0/nextjs-auth0';
import {notFound, redirect} from 'next/navigation';
import {getStudentByIdWithTutors} from '@/lib/students.ts';
import {getNotificationById} from '@/lib/notifications.ts';
import TutorContactInfo from '@/components/contact-display.tsx';

export default withPageAuthRequired(async ({params}: {
	readonly params?: {
		notificationId?: string;
	};
}) => {
	const notificationId = params!.notificationId!;
	const notification = await getNotificationById(Number.parseInt(notificationId, 10));

	if (notification === null) {
		redirect('/notifications');
	}

	const student = await getStudentByIdWithTutors(notification.studentId);

	return (
		<div className='flex flex-col h-full'>
			<h1 className='text-stone-200 text-xl mb-5'>
				{`${student.givenName} ${student.familyName}`}
			</h1>
			<TutorContactInfo infoId={notification.tutorId} className='mb-5'/>
			<h3 className='text-stone-200'>Fecha de envío:</h3>
			<p className='text-base text-stone-300 mb-5'>
				{notification.sentTime.toLocaleString()}
			</p>
			<h3 className='text-stone-200'>Mensaje:</h3>
			<p className='flex text-stone-400 bg-stone-700 w-full h-full grow rounded text-s min-h-[80px] p-1 border border-stone-600 '>
				{notification.message}
			</p>
		</div>
	);
}, {
	returnTo: '/',
});


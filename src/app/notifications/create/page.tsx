import React from 'react';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {type Tutor} from '@prisma/client';
import {getStudentById, createNotificationAction} from '@/lib/send-notification.ts';
import {type FormState} from '@/components/form.tsx';
import {decodeForm} from '@/lib/schemas/utils.ts';
import {handleActionError} from '@/lib/action-utils.ts';
import {type NotificationInit, notificationInit} from '@/lib/schemas/notification.ts';
import NotificationForm from '@/app/notifications/create/notification-form.tsx';

export type NotificationCreationPageProps = {
	readonly studentId: number;
	readonly givenName: string;
	readonly familyName: string;
	readonly tutors: Tutor[];
};

export default function NotificationCreationPage(props: NotificationCreationPageProps) {
	const {
		studentId,
		givenName,
		familyName,
		tutors,
	} = props;

	// If (student === null) {
	// 	redirect('/students');
	// }

	return (
		<div>
			<h3 className='text-stone-200 text-2xl mb-4'> {givenName} {familyName} </h3>
			<NotificationForm tutor={tutors} student={studentId} action={createNotificationAction}/>
		</div>
	);
}

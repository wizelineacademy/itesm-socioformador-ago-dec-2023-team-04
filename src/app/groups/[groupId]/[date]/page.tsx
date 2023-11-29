import React from 'react';
import {notFound, redirect} from 'next/navigation';
import {getLocalTimeZone, parseDate} from '@internationalized/date';
import {revalidatePath} from 'next/cache';
import {getGroupWithStudentsAttendance} from '@/lib/groups.ts';
import {makeSerializable} from '@/lib/serializable.ts';
import {groupHasClass} from '@/app/groups/class-dates.ts';
import AttendanceClientPage from '@/app/groups/[groupId]/[date]/attendance-client-page.tsx';
import {getUserFromSession} from '@/lib/users.ts';
import {type FormState} from '@/components/form.tsx';
import {notificationInit, type NotificationInit} from '@/lib/schemas/notification.ts';
import {decodeForm} from '@/lib/schemas/utils.ts';
import {createNotification} from '@/lib/notifications.ts';
import {handleActionError} from '@/lib/action-utils.ts';

export type EditGroupDetailPageProps = {
	readonly params: {
		readonly groupId: string;
		readonly date: string;
	};
};

export default async function GroupDatePage(props: EditGroupDetailPageProps) {
	const {params} = props;
	const id = Number.parseInt(params.groupId, 10);
	const date = parseDate(params.date);

	const group = await getGroupWithStudentsAttendance(id, date.toDate(getLocalTimeZone()));
	if (group === null) {
		redirect('/groups');
	}

	if (!groupHasClass(group, date)) {
		notFound();
	}

	const serializableGroup = makeSerializable(group);
	const user = await getUserFromSession();

	if (user === null) {
		throw new Error('User not found');
	}

	const sendNotificationAction = async (state: FormState<Partial<NotificationInit>>, data: FormData): Promise<FormState<Partial<NotificationInit>>> => {
		'use server';
		try {
			const parsedData = await decodeForm(data, notificationInit);
			const notification = await createNotification(parsedData);
		} catch (error) {
			return handleActionError(state, error);
		}

		revalidatePath('/notifications');
		return {
			...state,
			success: true,
			formErrors: [],
			fieldErrors: {},
		};
	};

	return (
		<AttendanceClientPage group={serializableGroup} date={params.date} user={user} sendNotificationAction={sendNotificationAction} serverTz={getLocalTimeZone()}/>
	);
}

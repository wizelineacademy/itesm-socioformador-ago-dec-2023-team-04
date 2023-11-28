import React from 'react';
import {notFound, redirect} from 'next/navigation';
import {getLocalTimeZone, parseDate, today} from '@internationalized/date';
import {getGroupWithStudentsAttendance} from '@/lib/groups.ts';
import {makeSerializable} from '@/lib/serializable.ts';
import {groupHasClass} from '@/app/groups/class-dates.ts';
import AttendanceClientPage from '@/app/groups/[groupId]/[date]/attendance-client-page.tsx';
import {getUserFromSession} from '@/lib/users.ts';

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

	return (
		<AttendanceClientPage group={serializableGroup} date={params.date} user={user} serverTz={getLocalTimeZone()}/>
	);
}

import React from 'react';
import {notFound, redirect} from 'next/navigation';
import {getLocalTimeZone, parseDate, today} from '@internationalized/date';
import {getGroupWithStudentsAttendance} from '@/lib/group.ts';
import AttendanceTable from '@/app/groups/[groupId]/attendance-table.tsx';
import {makeSerializable} from '@/lib/serializable.ts';
import {getGroupClassDate, groupHasClass} from '@/app/groups/class-dates.ts';
import Icon from '@/components/icon.tsx';
import LinkButton from '@/components/link-button.tsx';

export type EditGroupDetailPageProps = {
	readonly params: {
		readonly groupId: string;
		readonly date: string;
	};
};

export default async function EditGroupDetailPage(props: EditGroupDetailPageProps) {
	const {params} = props;
	const id = Number.parseInt(params.groupId, 10);
	const date = parseDate(params.date);

	const group = await getGroupWithStudentsAttendance(id, new Date());

	if (group === null) {
		redirect('/groups');
	}

	if (!groupHasClass(group, date)) {
		notFound();
	}

	const serializableGroup = makeSerializable(group);

	return (
		<div className='bg-stone-800 rounded'>
			<AttendanceTable group={serializableGroup} date={params.date}/>
		</div>
	);
}

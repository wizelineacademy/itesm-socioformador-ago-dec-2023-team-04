import React, {type ReactNode} from 'react';
import {notFound} from 'next/navigation';
import {parseDate} from '@internationalized/date';
import TopBarPageTemplate from '@/components/top-bar-page-template.tsx';
import {getGroupWithStudentsAttendance} from '@/lib/group.ts';
import GroupTopBarItems from '@/app/groups/[groupId]/[date]/group-topbar-items.tsx';
import FormattedDate from '@/app/groups/[groupId]/[date]/formatted-date.tsx';

export type GroupLayoutProps = {
	readonly children: ReactNode;
	readonly params: {
		readonly groupId: string;
		readonly date: string;
	};
};

export default async function GroupLayout(props: GroupLayoutProps) {
	const {params, children} = props;
	const id = Number.parseInt(params.groupId, 10);
	const group = await getGroupWithStudentsAttendance(id, new Date());
	const currentDate = parseDate(params.date);

	if (group === null) {
		return notFound();
	}

	return (
		<TopBarPageTemplate title={group.name} subtitle={<FormattedDate date={currentDate.toString()} tz={group.tz}/>} topBarItems={<GroupTopBarItems group={group} date={currentDate}/>}>
			{children}
		</TopBarPageTemplate>
	);
}

import React from 'react';
import EditGroupsClientLayout from '@/app/groups/edit/edit-groups-client-layout.tsx';
import {getAllGroups, getAllGroupsWithStudentCount} from '@/lib/group.ts';

export default async function NotificationsLayout({children}: {children: React.ReactNode}) {
	const groups = await getAllGroupsWithStudentCount();
	return (
		<EditGroupsClientLayout groups={groups}>
			{children}
		</EditGroupsClientLayout>
	);
}

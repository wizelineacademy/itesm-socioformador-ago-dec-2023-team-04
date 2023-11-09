import React from 'react';
import EditGroupsClientLayout from '@/app/groups/edit/edit-groups-client-layout.tsx';
import {getAllGroups} from '@/lib/group.ts';

export default async function NotificationsLayout({children}: {children: React.ReactNode}) {
	const groups = await getAllGroups();
	return (
		<EditGroupsClientLayout groups={groups}>
			{children}
		</EditGroupsClientLayout>
	);
}

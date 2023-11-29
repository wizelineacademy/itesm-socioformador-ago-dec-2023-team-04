import React from 'react';
import {revalidatePath} from 'next/cache';
import EditGroupsClientLayout from '@/app/groups/edit/edit-groups-client-layout.tsx';
import {deleteGroups, getAllGroupsWithStudentCount} from '@/lib/groups.ts';

export default async function NotificationsLayout({children}: {children: React.ReactNode}) {
	const groups = await getAllGroupsWithStudentCount();

	const deleteGroupsAction = async (groups: number[]) => {
		'use server';
		const count = await deleteGroups(groups);

		revalidatePath('/groups');

		return count;
	};

	return (
		<EditGroupsClientLayout groups={groups} action={deleteGroupsAction}>
			{children}
		</EditGroupsClientLayout>
	);
}

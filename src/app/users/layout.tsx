import React from 'react';
import {revalidatePath} from 'next/cache';
import {type Metadata} from 'next';
import {deleteUsers, getAllUsers} from '@/lib/users.ts';
import UserAdminClientLayout from '@/app/users/user-admin-client-layout.tsx';

export const metadata: Metadata = {
	title: 'Usuarios | SATS',
	description: 'metaphora. Student Attendance Tracking System',
};

export default async function UsersLayout({children}: {children: React.ReactNode}) {
	const users = await getAllUsers();

	const deleteUsersAction = async (users: number[]) => {
		'use server';
		await deleteUsers(users);
		revalidatePath('/users');
	};

	return (
		<UserAdminClientLayout users={users} action={deleteUsersAction}>
			{children}
		</UserAdminClientLayout>
	);
}

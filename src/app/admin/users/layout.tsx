import React from 'react';
import {revalidatePath} from 'next/cache';
import {deleteUsers, getAllUsers} from '@/lib/users.ts';
import UserAdminClientLayout from '@/app/admin/users/user-admin-client-layout.tsx';

export default async function UsersLayout({children}: {children: React.ReactNode}) {
	const users = await getAllUsers();

	const deleteUsersAction = async (users: number[]) => {
		'use server';
		await deleteUsers(users);
		revalidatePath('/admin/users');
	};

	return (
		<UserAdminClientLayout users={users} action={deleteUsersAction}>
			{children}
		</UserAdminClientLayout>
	);
}

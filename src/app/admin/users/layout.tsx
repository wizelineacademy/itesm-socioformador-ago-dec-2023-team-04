import React from 'react';
import {getAllUsers} from '@/lib/user.ts';
import UserAdminClientLayout from '@/app/admin/users/user-admin-client-layout.tsx';

export default async function UsersLayout({children}: {children: React.ReactNode}) {
	const users = await getAllUsers();
	return (
		<UserAdminClientLayout users={users}>
			{children}
		</UserAdminClientLayout>
	);
}

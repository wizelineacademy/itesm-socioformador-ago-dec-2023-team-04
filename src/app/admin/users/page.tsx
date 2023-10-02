import React from 'react';
import UserAdminTable from '@/components/user-admin-table.tsx';
import {getAllUsers} from '@/lib/user.ts';

export default async function Users() {
	const users = await getAllUsers();
	return (
		<div>
			<h1 className='text-4xl mb-4'>
				Usuarios
			</h1>

			<div className='bg-stone-800 p-4 rounded'>
				<UserAdminTable users={users} className='w-full'/>
			</div>
		</div>
	);
}

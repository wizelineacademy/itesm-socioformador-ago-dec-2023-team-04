import React from 'react';
import Link from 'next/link';
import UserAdminTable from '@/app/admin/users/user-admin-table.tsx';
import {getAllUsers} from '@/lib/user.ts';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import Spacer from '@/components/spacer.tsx';

export default async function UsersLayout({children}: {children: React.ReactNode}) {
	const users = await getAllUsers();
	return (
		<div className='flex flex-col h-full'>
			<div className='flex items-top mb-4'>
				<h1 className='text-4xl'>
					Usuarios
				</h1>
				<Spacer/>
				<Link href='/admin/users/create'>
					<Button variant='secondary'><Icon name='add'/></Button>
				</Link>
			</div>

			<div className='flex gap-4 h-full'>
				<div className='bg-stone-800 grow rounded'>
					<UserAdminTable users={users} className='w-full'/>
				</div>
				<div className='w-72 bg-stone-800 h-full rounded p-4'>
					{children}
				</div>
			</div>
		</div>
	);
}

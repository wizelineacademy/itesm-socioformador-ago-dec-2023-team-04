'use client';
import React from 'react';
import Link from 'next/link';
import {type User} from '@prisma/client';
import Spacer from '@/components/spacer.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import UserAdminTable from '@/app/admin/users/user-admin-table.tsx';

export default function UserAdminClientLayout({children, initialUsers}: {readonly initialUsers: User[]; readonly children: React.ReactNode}) {
	const [userSelection, setUserSelection] = React.useState<Record<string, boolean>>({});
	// Todo add action on delete button click
	return (
		<div className='flex flex-col h-full'>
			<div className='flex items-top mb-4 gap-4'>
				<h1 className='text-4xl'>
					Usuarios
				</h1>
				<Spacer/>
				<Button variant='destructive' disabled={Object.keys(userSelection).length === 0}> <Icon name='delete'/></Button>
				<Link href='/admin/users/create'>
					<Button variant='secondary'><Icon name='add'/></Button>
				</Link>
			</div>

			<div className='flex gap-4 h-full'>
				<div className='bg-stone-800 grow rounded'>
					<UserAdminTable initialUsers={initialUsers} className='w-full' userSelection={userSelection} onUserSelectionChange={setUserSelection}/>
				</div>
				<div className='w-72 bg-stone-800 h-full rounded p-4'>
					{children}
				</div>
			</div>
		</div>
	);
}

'use client';
import React from 'react';
import Link from 'next/link';
import {type User} from '@prisma/client';
import * as Popover from '@radix-ui/react-popover';
import {useQueryClient} from 'react-query';
import Spacer from '@/components/spacer.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import UserAdminTable from '@/app/admin/users/user-admin-table.tsx';
import deleteUsers from '@/app/admin/users/delete-users-action.ts';

export default function UserAdminClientLayout({children, initialUsers}: {readonly initialUsers: User[]; readonly children: React.ReactNode}) {
	const [userSelection, setUserSelection] = React.useState<Record<string, boolean>>({});
	const queryClient = useQueryClient();

	const handleDeleteClick = async () => {
		const result = await deleteUsers(Object.entries(userSelection).filter(([, value]) => value).map(([key]) => Number.parseInt(key, 10)));

		await queryClient.invalidateQueries('users');

		console.log(result);
	};

	return (
		<div className='flex flex-col h-full'>
			<div className='flex items-top mb-4 gap-4'>
				<h1 className='text-4xl'>
					Usuarios
				</h1>
				<Spacer/>
				<Popover.Root>
					<Popover.Trigger asChild>
						<Button color='destructive' isDisabled={Object.keys(userSelection).length === 0}> <Icon name='delete'/></Button>
					</Popover.Trigger>
					<Popover.Portal>
						<Popover.Content align='end'>
							<Popover.Arrow className='fill-stone-700'/>
							<div className='bg-stone-700 p-4 w-48 rounded'>
								<p className='text-stone-200 mb-2 text-sm'>
									¿Borrar los registros seleccionados?
								</p>
								<Button color='destructive' size='sm' onPress={handleDeleteClick}> Borrar </Button>
							</div>
						</Popover.Content>
					</Popover.Portal>
				</Popover.Root>
				<Link href='/admin/users/create'>
					<Button color='secondary'><Icon name='add'/></Button>
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

'use client';
import React, {type Key, useState} from 'react';
import Link from 'next/link';
import {type User} from '@prisma/client';
import * as Popover from '@radix-ui/react-popover';
import {useQuery, useQueryClient} from 'react-query';
import {createColumnHelper} from '@tanstack/table-core';
import axios from 'axios';
import Spacer from '@/components/spacer.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import TopbarPageLayout from '@/components/topbar-page-layout.tsx';
import TextField from '@/components/text-field.tsx';
import Checkbox from '@/components/checkbox.tsx';
import Table from '@/components/table.tsx';
import {deleteUsers} from '@/lib/actions/user.ts';
import {selectColumn} from '@/components/table-columns.tsx';
import DeleteButton from '@/components/delete-button.tsx';

const columnHelper = createColumnHelper<User>();

const columns = [
	selectColumn(columnHelper),
	columnHelper.accessor('email', {
		header: 'Correo electrónico',
		cell: info => info.getValue(),
	}),
	columnHelper.accessor('givenName', {
		header: 'Nombre(s)',
		cell: info => info.getValue(),
	}),
	columnHelper.accessor('familyName', {
		header: 'Apellidos(s)',
		cell: info => info.getValue(),
	}),
	columnHelper.accessor('admin', {
		header: 'Permisos',
		cell: info => info.getValue() ? 'Admin' : 'Usuario',
	}),
	columnHelper.accessor('id', {
		header: '',
		cell: info => (
			<Link href={`/admin/${info.getValue()}`}>
				<Button variant='text' color='tertiary' size='sm' className='hover:bg-stone-600'>
					<Icon name='edit'/>
				</Button>
			</Link>
		),
	}),
];

export default function UserAdminClientLayout({children, initialUsers}: {
	readonly initialUsers: User[];
	readonly children: React.ReactNode;
}) {
	const [userSelection, setUserSelection] = React.useState<Record<string, boolean>>({});
	const queryClient = useQueryClient();

	const handleDeleteClick = async () => {
		const result = await deleteUsers(Object.entries(userSelection).filter(([, value]) => value).map(([key]) => Number.parseInt(key, 10)));

		await queryClient.invalidateQueries('users');

		console.log(result);
	};

	const {data: users} = useQuery('users', async () => {
		const result = await axios.get<User[]>('/api/users');
		console.log(result);
		return result.data;
	}, {
		initialData: initialUsers,
		staleTime: 5000,
	});

	const [globalFilter, setGlobalFilter] = useState('');
	const [selectedStudents, setSelectedStudents] = useState<Set<Key>>(new Set());

	return (
		<TopbarPageLayout
			title='Usuarios' topbarItems={
				<>
					<Spacer/>
					<DeleteButton
						label='¿Borrar los registros seleccionados?' isDisabled={selectedStudents.size === 0}
						onDelete={handleDeleteClick}/>
					<Link href='/admin/users/create'>
						<Button color='secondary'><Icon name='add'/></Button>
					</Link>

					<TextField aria-label='Buscar' iconName='search' value={globalFilter} onChange={setGlobalFilter}/>
				</>
			}
		>
			<div className='flex gap-4'>
				<div className='bg-stone-800 grow rounded'>
					<Table
						data={users ?? []} columns={columns}
						selectedKeys={selectedStudents} globalFilter={globalFilter}
						onSelectedKeysChange={setSelectedStudents}
					/>
				</div>
				<div className='w-72 bg-stone-800 h-full rounded p-4'>
					{children}
				</div>
			</div>
		</TopbarPageLayout>
	);
}

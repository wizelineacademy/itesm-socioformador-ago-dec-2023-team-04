'use client';
import React, {type ReactNode, useState} from 'react';
import Link from 'next/link';
import {type User} from '@prisma/client';
import {createColumnHelper} from '@tanstack/table-core';
import {type Key} from 'react-stately';
import Spacer from '@/components/spacer.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import TopBarPageTemplate from '@/components/top-bar-page-template.tsx';
import TextField from '@/components/text-field.tsx';
import Table from '@/components/table.tsx';
import DeleteButton from '@/components/delete-button.tsx';
import {deleteUsers} from '@/lib/users.ts';

const columnHelper = createColumnHelper<User>();

const columns = [
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
];

export type UserAdminClientLayoutProps = {
	readonly children: ReactNode;
	readonly users: User[];
	readonly action: (users: number[]) => Promise<void>;
};

export default function UserAdminClientLayout(props: UserAdminClientLayoutProps) {
	const {children, users, action} = props;
	const [globalFilter, setGlobalFilter] = useState('');
	const [selectedStudents, setSelectedStudents] = useState<Set<Key>>(new Set());

	const handleDeleteClick = async () => {
		await action([...selectedStudents].map(key => Number.parseInt(key.toString(), 10)));

		setSelectedStudents(new Set());
	};

	return (
		<TopBarPageTemplate
			title='Usuarios' topBarItems={
				<>
					<Spacer/>
					<DeleteButton label='¿Borrar los registros seleccionados?' isDisabled={selectedStudents.size === 0} onDelete={handleDeleteClick}/>
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
						className='w-full'
						data={users ?? []} columns={columns}
						selectedKeys={selectedStudents} globalFilter={globalFilter}
						getDetailsLink={user => `/admin/users/${user.id}`}
						onSelectedKeysChange={setSelectedStudents}
					/>
				</div>
				<div className='w-72 bg-stone-800 h-full rounded p-4'>
					{children}
				</div>
			</div>
		</TopBarPageTemplate>
	);
}

'use client';
import React, {type Key, type ReactNode, useState} from 'react';
import Link from 'next/link';
import {type User} from '@prisma/client';
import {createColumnHelper} from '@tanstack/table-core';
import Spacer from '@/components/spacer.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import TopbarPageLayout from '@/components/topbar-page-layout.tsx';
import TextField from '@/components/text-field.tsx';
import Table from '@/components/table.tsx';
import {detailsLinkColumn, selectColumn} from '@/components/table-columns.tsx';
import DeleteButton from '@/components/delete-button.tsx';
import {deleteUsers} from '@/lib/actions/user.ts';

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
	detailsLinkColumn(columnHelper, '/admin'),
];

export type UserAdminClientLayoutProps = {
	readonly children: ReactNode;
	readonly users: User[];
};

export default function UserAdminClientLayout(props: UserAdminClientLayoutProps) {
	const {children, users} = props;
	const [globalFilter, setGlobalFilter] = useState('');
	const [selectedStudents, setSelectedStudents] = useState<Set<Key>>(new Set());

	const handleDeleteClick = async () => {
		const result = await deleteUsers([...selectedStudents].map(key => Number.parseInt(key.toString(), 10)));
	};

	return (
		<TopbarPageLayout
			title='Usuarios' topbarItems={
				<>
					<Spacer/>
					<DeleteButton label='¿Borrar los registros seleccionados?' isDisabled={selectedStudents.size === 0} onDelete={handleDeleteClick}/>
					<Link href='/admin/create'>
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

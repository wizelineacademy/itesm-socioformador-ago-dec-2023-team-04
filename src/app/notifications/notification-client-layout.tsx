'use client';
import React, {useState} from 'react';
import Link from 'next/link';
import {type Student, type Tutor, type TutorNotification} from '@prisma/client';
import {createColumnHelper} from '@tanstack/table-core';
import {type Key} from 'react-stately';
import Spacer from '@/components/spacer.tsx';
import TopBarPageTemplate from '@/components/top-bar-page-template.tsx';
import TextField from '@/components/text-field.tsx';
import DeleteButton from '@/components/delete-button.tsx';
import Table from '@/components/table.tsx';
import {deleteNotifications} from '@/lib/actions/notification.ts';

const columnHelper = createColumnHelper<TutorNotification>();

const columns = [
	columnHelper.accessor('studentId', {
		header: 'Apellido del alumno',
		cell: info => info.getValue(),
	}),
	columnHelper.accessor('tutorId', {
		header: 'Nombre del tutor',
		cell: info => info.getValue(),
	}),
	columnHelper.accessor('tutorId', {
		header: 'Apellido del tutor',
		cell: info => info.getValue(),
	}),
];

export type NotificationClientLayoutProps = {
	readonly notifications: TutorNotification[];
	readonly children: React.ReactNode;
};

export default function NotificationClientLayout({children, notifications}: {
	readonly notifications: TutorNotification[];
	readonly children: React.ReactNode;
}) {
	const [globalFilter, setGlobalFilter] = useState<string>('');

	const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(new Set());

	const handleDelete = async () => {
		const result = await deleteNotifications([...selectedKeys].map(key => Number.parseInt(key.toString(), 10)));

		if (result.success) {
			setSelectedKeys(new Set());
		}
	};

	return (
		<TopBarPageTemplate
			title='Notificaciones' topBarItems={
				<>
					<Spacer/>
					<DeleteButton label='¿Borrar los registros seleccionados?' isDisabled={selectedKeys.size === 0} onDelete={handleDelete}/>
					<TextField aria-label='Buscar' iconName='search' value={globalFilter} onChange={setGlobalFilter}/>
				</>
			}
		>
			<div className='flex gap-4'>
				<div className='bg-stone-800 grow rounded'>
					<Table
						className='w-full' data={notifications ?? []} columns={columns}
						selectedKeys={selectedKeys} globalFilter={globalFilter}
						getDetailsLink={notification => `/notifications/${notification.id}`} onSelectedKeysChange={setSelectedKeys}/>
				</div>
				<div className='w-72 sticky bg-stone-800 h-fit rounded p-4 top-4'>
					{children}
				</div>
			</div>
		</TopBarPageTemplate>
	);
}


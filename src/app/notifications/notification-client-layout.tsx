'use client';
import React, {useState} from 'react';
import Link from 'next/link';
import {createColumnHelper} from '@tanstack/table-core';
import {type Key} from 'react-stately';
import Spacer from '@/components/spacer.tsx';
import TopBarPageTemplate from '@/components/top-bar-page-template.tsx';
import TextField from '@/components/text-field.tsx';
import DeleteButton from '@/components/delete-button.tsx';
import Table from '@/components/table.tsx';
import {deleteNotifications} from '@/lib/actions/notification.ts';
import {type NotificationsWithStudentsAndTutors} from '@/lib/notification.ts';

const columnHelper = createColumnHelper<NotificationsWithStudentsAndTutors>();

const columns = [
	columnHelper.accessor('student.givenName', {
		header: 'Nombre(s) alumno',
		cell: info => info.getValue(),
	}),
	columnHelper.accessor('student.familyName', {
		header: 'Apellido(s) alumno',
		cell: info => info.getValue(),
	}),
	columnHelper.accessor('tutor.givenName', {
		header: 'Nombre(s) tutor',
		cell: info => info.getValue(),
	}),
	columnHelper.accessor('tutor.familyName', {
		header: 'Apellido(s) tutor',
		cell: info => info.getValue(),
	}),
	columnHelper.accessor('sentTime', {
		header: 'Fechas de envío',
		cell: info => (info.getValue() as Date).toLocaleString(),
	}),
];

export type NotificationClientLayoutProps = {
	readonly notifications: NotificationsWithStudentsAndTutors;
	readonly children: React.ReactNode;
};

export default function NotificationClientLayout({children, notifications}: {
	readonly notifications: NotificationsWithStudentsAndTutors;
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


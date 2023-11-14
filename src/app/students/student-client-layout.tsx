'use client';
import React, {type Key, useState} from 'react';
import Link from 'next/link';
import {type Student} from '@prisma/client';
import {createColumnHelper} from '@tanstack/table-core';
import Spacer from '@/components/spacer.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import Table from '@/components/table.tsx';
import DeleteButton from '@/components/delete-button.tsx';
import TextField from '@/components/text-field.tsx';
import TopbarPageLayout from '@/components/topbar-page-layout.tsx';
import {deleteStudents} from '@/lib/actions/student.ts';
import {detailsLinkColumn, selectColumn} from '@/components/table-columns.tsx';
import SearchField from '@/components/search-field.tsx';

const columnHelper = createColumnHelper<Student>();

const columns = [
	selectColumn(columnHelper),
	columnHelper.accessor('registration', {
		header: 'Matrícula',
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
	detailsLinkColumn(columnHelper, '/students'),
];

export type StudentClientLayoutProps = {
	readonly students: Student[];
	readonly children: React.ReactNode;
};

export default function StudentClientLayout({children, students}: {
	readonly students: Student[];
	readonly children: React.ReactNode;
}) {
	const [globalFilter, setGlobalFilter] = useState<string>('');

	const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(new Set());

	const handleDelete = async () => {
		const result = await deleteStudents([...selectedKeys].map(key => Number.parseInt(key.toString(), 10)));

		if (result.success) {
			setSelectedKeys(new Set());
		}
	};

	return (
		<TopbarPageLayout
			title='Alumnos' topbarItems={
				<>
					<Spacer/>
					<DeleteButton
						label='¿Borrar los registros seleccionados?' isDisabled={selectedKeys.size === 0}
						onDelete={handleDelete}/>
					<Link href='/students/create'>
						<Button color='secondary'><Icon name='add'/></Button>
					</Link>
					<SearchField value={globalFilter} className='w-72 justify-between' onChange={setGlobalFilter}/>
				</>
			}
		>
			<div className='flex gap-4'>
				<div className='bg-stone-800 grow rounded'>
					<Table
						className='w-full' data={students ?? []} columns={columns}
						selectedKeys={selectedKeys} globalFilter={globalFilter}
						onSelectedKeysChange={setSelectedKeys}/>
				</div>
				<div className='w-72 sticky bg-stone-800 h-fit rounded p-4 top-4'>
					{children}
				</div>
			</div>
		</TopbarPageLayout>
	);
}

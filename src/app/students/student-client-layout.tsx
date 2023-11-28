'use client';
import React, {useState} from 'react';
import Link from 'next/link';
import {type Student} from '@prisma/client';
import {createColumnHelper} from '@tanstack/table-core';
import {type Key} from 'react-stately';
import Spacer from '@/components/spacer.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import Table from '@/components/table.tsx';
import DeleteButton from '@/components/delete-button.tsx';
import TextField from '@/components/text-field.tsx';
import TopBarPageTemplate from '@/components/top-bar-page-template.tsx';

const columnHelper = createColumnHelper<Student>();

const columns = [
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
];

export type StudentClientLayoutProps = {
	readonly students: Student[];
	readonly children: React.ReactNode;
	readonly action: (students: number[]) => Promise<void>;
};

export default function StudentClientLayout(props: StudentClientLayoutProps) {
	const {students, children, action} = props;
	const [globalFilter, setGlobalFilter] = useState<string>('');

	const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(new Set());

	const handleDelete = async () => {
		await action([...selectedKeys].map(key => Number.parseInt(key.toString(), 10)));
		setSelectedKeys(new Set());
	};

	return (
		<TopBarPageTemplate
			title='Alumnos' topBarItems={
				<>
					<Spacer/>
					<DeleteButton label='¿Borrar los registros seleccionados?' isDisabled={selectedKeys.size === 0} onDelete={handleDelete}/>
					<Link href='/students/create'>
						<Button color='secondary'><Icon name='add'/></Button>
					</Link>
					<TextField aria-label='Buscar' iconName='search' value={globalFilter} onChange={setGlobalFilter}/>
				</>
			}
		>
			<div className='flex gap-4'>
				<div className='bg-stone-800 grow rounded'>
					<Table
						className='w-full' data={students ?? []} columns={columns}
						selectedKeys={selectedKeys} globalFilter={globalFilter}
						getDetailsLink={student => `/students/${student.id}`} onSelectedKeysChange={setSelectedKeys}/>
				</div>
				<div className='w-72 sticky bg-stone-800 h-fit rounded p-4 top-4'>
					{children}
				</div>
			</div>
		</TopBarPageTemplate>
	);
}

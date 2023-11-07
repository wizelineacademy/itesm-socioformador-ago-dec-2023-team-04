'use client';
import React, {type Key, useRef, useState} from 'react';
import Link from 'next/link';
import {type Student} from '@prisma/client';
import {useQuery, useQueryClient} from 'react-query';
import axios from 'axios';
import {createColumnHelper} from '@tanstack/table-core';
import Spacer from '@/components/spacer.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import Checkbox from '@/components/checkbox.tsx';
import Table from '@/components/table.tsx';
import DeleteButton from '@/components/delete-button.tsx';
import deleteStudents from '@/app/students/delete-students-action.ts';
import TextField from '@/components/text-field.tsx';
import TopBar from '@/components/top-bar.tsx';
import TopbarPageLayout from '@/components/topbar-page-layout.tsx';

const columnHelper = createColumnHelper<Student>();

const columns = [
	columnHelper.display({
		id: 'select',
		header({table}) {
			let checked: 'indeterminate' | boolean = table.getIsAllRowsSelected();
			if (!checked) {
				checked = table.getIsSomeRowsSelected() ? 'indeterminate' : false;
			}

			return (
				<div className='flex items-center justify-center'>
					<Checkbox
						checked={checked} onCheckedChange={() => {
							table.toggleAllRowsSelected();
						}}/>
				</div>
			);
		},
		cell: ({row}) => (
			<div className='flex items-center justify-center'>
				<Checkbox
					checked={row.getIsSelected()} className='group-hover:border-stone-600 hover:bg-stone-600'
					onCheckedChange={() => {
						row.toggleSelected();
					}}/>
			</div>
		),
	}),
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
	columnHelper.accessor('id', {
		header: 'Información',
		cell: info => (
			<Link href={`/students/${info.getValue()}`}>
				<Button variant='text' color='tertiary' size='sm' className='hover:bg-stone-600'>
					<Icon name='chevron_right'/>
				</Button>
			</Link>
		),
	}),
];

export default function StudentClientLayout({children, initialStudents}: {
	readonly initialStudents: Student[];
	readonly children: React.ReactNode;
}) {
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const queryClient = useQueryClient();

	const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(new Set());

	const {data: students} = useQuery('students', async () => {
		const result = await axios.get<Student[]>('/api/students');
		console.log(result);
		return result.data;
	}, {
		initialData: initialStudents,
		staleTime: 5000,
	});

	const handleDeleteClick = async () => {
		const studentIds = [...selectedKeys.values()].map(key => {
			if (typeof key === 'string') {
				return Number.parseInt(key, 10);
			}

			return Number(key);
		});
		const result = await deleteStudents(studentIds);

		if (result.success) {
			await queryClient.invalidateQueries('students');
			setSelectedKeys(new Set());
		}
	};

	return (
		<TopbarPageLayout
			title='Alumnos' topbarItems={
				<>
					<Spacer/>
					<DeleteButton label='¿Borrar los registros seleccionados?' isDisabled={selectedKeys.size === 0} onDelete={handleDeleteClick}/>
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
						onSelectedKeysChange={setSelectedKeys}/>
				</div>
				<div className='w-72 sticky bg-stone-800 h-fit rounded p-4 top-4'>
					{children}
				</div>
			</div>
		</TopbarPageLayout>
	);
}

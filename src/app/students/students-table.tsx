'use client';
import React, {useState} from 'react';
import {createColumnHelper, getCoreRowModel} from '@tanstack/table-core';
import {type Student} from '@prisma/client';
import {flexRender, useReactTable, getSortedRowModel, getFilteredRowModel} from '@tanstack/react-table';
import clsx from 'clsx';
import {useQuery} from 'react-query';
import axios from 'axios';
import Link from 'next/link';
import Checkbox from '@/components/checkbox.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import onChange from '@/components/search-bar.tsx';

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
				<Button variant='tertiary' size='sm' className='hover:bg-stone-600'>
					<Icon name='chevron_right'/>
				</Button>
			</Link>
		),
	}),
];

export default function StudentsTable(
	{
		initialStudents,
		className,
		studentSelection,
		onStudentSelectionChange,
	}:
	{
		readonly initialStudents: Student[];
		readonly className?: string;
		readonly studentSelection: Record<string, boolean>;
		readonly onStudentSelectionChange: (newSelection: (Record<string, boolean> | ((old: Record<string, boolean>) => Record<string, boolean>))) => void;
	},
) {
	const {data} = useQuery('students', async () => {
		const result = await axios.get<Student[]>('/api/students');
		console.log(result);
		return result.data;
	}, {
		initialData: initialStudents,
		staleTime: 5000,
	});

	const [sorting, setSorting] = useState([]);
	const [filtering, setFiltering] = useState('');
	const table = useReactTable({
		data: data ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			rowSelection: studentSelection,
			sorting,
			globalFilter: filtering,
		},
		enableRowSelection: true,
		onSortingChange: setSorting,
		onGlobalFilterChange: setFiltering,
		onRowSelectionChange: onStudentSelectionChange,
		getRowId: ({id}) => id.toString(),
	});

	return (
		<table className={clsx(className)}>
			<input
				type='text' value={filtering} onChange={event => {
					setFiltering(event.target.value);
				}}/>
			<thead className='border-stone-700 border-b'>
				{table.getHeaderGroups().map(headerGroup => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map(header => (
							<th
								key={header.id} className='text-left py-2'
								onClick={header.column.getToggleSortingHandler()}
							>
								{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
								{{
									asc: <Icon name='arrow_upward'/>, desc: <Icon name='arrow_downward'/>,
								}[header.column.getIsSorted() ?? null]}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody>
				{table.getRowModel().rows.map(row => (
					<tr
						key={row.id}
						className='group rounded h-14'
					>
						{row.getVisibleCells().map(cell => (
							<td
								key={cell.id}
								className={clsx('group-hover:cursor-pointer', 'p-2 group-hover:bg-stone-700')}
								onClick={cell.column.id === 'información' ? undefined : row.getToggleSelectedHandler()}
							>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}

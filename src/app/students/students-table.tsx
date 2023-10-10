import React, {useState} from 'react';
import {createColumnHelper, getCoreRowModel, type SortingState} from '@tanstack/table-core';
import {type Student} from '@prisma/client';
import {flexRender, getFilteredRowModel, getSortedRowModel, useReactTable} from '@tanstack/react-table';
import clsx from 'clsx';
import {useQuery} from 'react-query';
import axios from 'axios';
import Link from 'next/link';
import Checkbox from '@/components/checkbox.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';

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
		globalFilter,
	}:
	{
		readonly initialStudents: Student[];
		readonly className?: string;
		readonly globalFilter?: string;
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

	const [sorting, setSorting] = useState<SortingState>([]);
	const table = useReactTable({
		data: data ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			rowSelection: studentSelection,
			sorting,
			globalFilter,
		},
		enableRowSelection: true,
		onSortingChange: setSorting,
		onRowSelectionChange: onStudentSelectionChange,
		getRowId: ({id}) => id.toString(),
	});

	return (
		<table className={clsx(className)}>
			<thead className='border-stone-700 border-b'>
				{table.getHeaderGroups().map(headerGroup => (
					<tr key={headerGroup.id} className='h-14'>
						{headerGroup.headers.map(header => (
							<th
								key={header.id} className='text-left p-2 hover:cursor-pointer'
								onClick={header.column.getToggleSortingHandler()}
							>
								{header.id === 'select'
									? flexRender(header.column.columnDef.header, header.getContext())
									: <div className='flex gap-2 items-center'>
										{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
										{header.column.getIsSorted() === 'asc'
											? <Icon name='arrow_upward' size='md'/> : null}
										{header.column.getIsSorted() === 'desc'
											? <Icon name='arrow_downward' size='md'/> : null}
										{header.column.getIsSorted() === false ? <Icon name='sort' size='md'/> : null}
									</div>}
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

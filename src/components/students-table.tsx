'use client';
import {createColumnHelper, getCoreRowModel} from '@tanstack/table-core';
import {type Student} from '@prisma/client';
import {flexRender, useReactTable} from '@tanstack/react-table';
import clsx from 'clsx';
import Checkbox from '@/components/checkbox.tsx';

const columnHelper = createColumnHelper<Student>();

const columns = [
	columnHelper.display({
		id: 'select',
		header: () => <Checkbox/>,
		cell: () => <Checkbox/>,
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
];

export default function StudentsTable({students, className}: {readonly students: Student[]; readonly className?: string}) {
	const table = useReactTable({
		data: students,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<table className={clsx(className)}>
			<thead className='border-stone-700 border-b'>
				{table.getHeaderGroups().map(headerGroup => (
					<tr key={headerGroup.id}>
						{headerGroup.headers.map(header => (
							<th key={header.id} className='text-left py-2'>
								{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
							</th>
						))}
					</tr>
				))}
			</thead>
			<tbody>
				{table.getRowModel().rows.map(row => (
					<tr key={row.id}>
						{row.getVisibleCells().map(cell => (
							<td key={cell.id} className='py-2'>
								{flexRender(cell.column.columnDef.cell, cell.getContext())}
							</td>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}
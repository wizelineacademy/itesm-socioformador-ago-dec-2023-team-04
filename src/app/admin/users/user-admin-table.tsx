'use client';
import React from 'react';
import {createColumnHelper, getCoreRowModel} from '@tanstack/table-core';
import {type User} from '@prisma/client';
import {flexRender, useReactTable} from '@tanstack/react-table';
import clsx from 'clsx';
import {useQuery} from 'react-query';
import axios from 'axios';
import Link from 'next/link';
import {useRouter} from 'next/navigation';
import Checkbox from '@/components/checkbox.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';

const columnHelper = createColumnHelper<User>();

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
					checked={row.getIsSelected()} className='group-hover:border-stone-600 hover:bg-stone-600' onCheckedChange={() => {
						row.toggleSelected();
					}}/>
			</div>
		),
	}),
	columnHelper.accessor('id', {
		header: 'ID',
		cell: info => info.getValue(),
	}),
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
		header: 'Tipo de usuario',
		cell: info => info.getValue() ? 'Administrador' : 'Usuario',
	}),
	columnHelper.accessor('id', {
		header: 'Editar',
		cell: info => (
			<Link href={`/admin/users/${info.getValue()}`}>
				<Button variant='tertiary' size='sm' className='hover:bg-stone-600'>
					<Icon name='edit'/>
				</Button>
			</Link>
		),
	}),
];

export default function UserAdminTable({users, className}: {readonly users: User[]; readonly className?: string}) {
	const {data} = useQuery('users', async () => {
		const result = await axios.get<User[]>('/api/users');
		console.log(result);
		return result.data;
	}, {
		initialData: users,
		staleTime: 5000,
	});

	const [rowSelection, setRowSelection] = React.useState<Record<string, boolean>>({});

	const table = useReactTable({
		data: data ?? [],
		columns,
		getCoreRowModel: getCoreRowModel(),
		state: {
			rowSelection,
		},
		enableRowSelection: true,
		onRowSelectionChange: setRowSelection,
	});

	const router = useRouter();

	return (
		<table className={className}>
			<thead className='border-stone-700 border-b'>
				{table.getHeaderGroups().map(headerGroup => (
					<tr key={headerGroup.id} className='h-14'>
						{headerGroup.headers.map(header => (
							<th key={header.id} className='text-left py-2 px-2'>
								{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
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
								onClick={cell.column.id === 'edit' ? undefined : row.getToggleSelectedHandler()}
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

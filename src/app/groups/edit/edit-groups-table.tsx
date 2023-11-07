import React, {type Key, useMemo, useState} from 'react';
import {createColumnHelper, getCoreRowModel, type RowSelectionState, type SortingState} from '@tanstack/table-core';
import {type Group, type TutorNotification} from '@prisma/client';
import {flexRender, getFilteredRowModel, getSortedRowModel, useReactTable} from '@tanstack/react-table';
import clsx from 'clsx';
import {useQuery} from 'react-query';
import axios from 'axios';
import Link from 'next/link';
import Checkbox from '@/components/checkbox.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';

const columnHelper = createColumnHelper<Group>();

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
	columnHelper.accessor('name', {
		header: 'Nombre',
		cell: info => info.getValue(),
	}),
	columnHelper.accessor('entryHour', {
		header: 'Hora de entrada',
		cell: info => info.getValue(),
	}),
	columnHelper.accessor('exitHour', {
		header: 'Hora de salida',
		cell: info => info.getValue(),
	}),
	columnHelper.accessor('colorId', {
		header: 'Color',
		cell: info => info.getValue(),
	}),
];

export type EditGroupsTableProps = {
	readonly groups: Group[];
	readonly className?: string;
	readonly globalFilter?: string;
	readonly selectedKeys: Set<Key>;
	readonly onSelectedKeysChange: (newSelection: Set<Key>) => void;
};

export default function EditGroupsTable(props: EditGroupsTableProps) {
	const {
		groups,
		className,
		globalFilter,
		selectedKeys,
		onSelectedKeysChange,
	} = props;

	const table = useReactTable({
		data: groups,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		state: {
			rowSelection,
			sorting,
			globalFilter,
		},
		enableRowSelection: true,
		onSortingChange: setSorting,
		onRowSelectionChange(updater) {
			const newSelection = typeof updater === 'function' ? updater(rowSelection) : updater;

			const newSelectedKeys = new Set<Key>();

			for (const [id, selected] of Object.entries(newSelection)) {
				if (selected) {
					newSelectedKeys.add(id);
				}
			}

			onSelectedKeysChange(newSelectedKeys);
		},
		getRowId: ({id}) => id.toString(),
	});

	return (
		<table className={clsx(className)}>
			<thead className='border-stone-700 border-b'>
				{table.getHeaderGroups().map(headerGroup => (
					<tr key={headerGroup.id} className='h-14 text-stone-100'>
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

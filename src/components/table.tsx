import React, {type Key, useMemo, useState} from 'react';
import clsx from 'clsx';
import {type ColumnDef, flexRender, getFilteredRowModel, getSortedRowModel, useReactTable} from '@tanstack/react-table';
import {getCoreRowModel, type SortingState} from '@tanstack/table-core';
import Icon from '@/components/icon.tsx';

export type TableProps<T> = {
	readonly className?: string;
	readonly data: T[];
	readonly columns: Array<ColumnDef<T, any>>;
	readonly globalFilter?: string;
	readonly selectedKeys: Set<Key>;
	readonly onSelectedKeysChange: (newSelection: Set<Key>) => void;
	readonly getKey?: (value: T) => Key;
};

export default function Table<T extends object>(props: TableProps<T>) {
	const {
		className,
		data,
		columns,
		globalFilter,
		selectedKeys,
		getKey = value => {
			if ('id' in value) {
				return value.id as Key;
			}

			if ('key' in value) {
				return value.key as Key;
			}

			throw new Error('unknown key for objects');
		},
		onSelectedKeysChange,
	} = props;

	const [sorting, setSorting] = useState<SortingState>([]);

	const rowSelection = useMemo(() => Object.fromEntries(
		data.map(value => {
			const key = getKey(value).toString();
			return [key, selectedKeys.has(key)];
		}),
	), [data, getKey, selectedKeys]);

	const table = useReactTable({
		data,
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
		getRowId: row => getKey(row).toString(),
	});

	return (
		<table className={className}>
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

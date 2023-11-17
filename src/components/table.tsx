import React, {useMemo, useState} from 'react';
import clsx from 'clsx';
import {type ColumnDef, flexRender, getFilteredRowModel, getSortedRowModel, useReactTable} from '@tanstack/react-table';
import {getCoreRowModel, type SortingState} from '@tanstack/table-core';
import {useLocale} from 'react-aria';
import {type Key} from 'react-stately';
import Link from 'next/link';
import Icon from '@/components/icon.tsx';
import {cx} from '@/lib/cva.ts';
import Checkbox from '@/components/checkbox.tsx';
import {Button} from '@/components/button.tsx';

export type TableProps<T> = {
	readonly className?: string;
	readonly data: T[];
	readonly columns: Array<ColumnDef<T, any>>;
	readonly globalFilter?: string;
	readonly selectedKeys?: Set<Key>;
	readonly onSelectedKeysChange?: (newSelection: Set<Key>) => void;
	readonly getKey?: (value: T) => Key;
	readonly getDetailsLink?: (value: T) => string;
};

export default function Table<T extends object>(props: TableProps<T>) {
	const {
		className,
		data,
		columns,
		globalFilter,
		getDetailsLink,
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

	const isSelectionEnabled = selectedKeys !== undefined && onSelectedKeysChange !== undefined;

	const rowSelection = useMemo(() => isSelectionEnabled ? Object.fromEntries(
		data.map(value => {
			const key = getKey(value).toString();
			return [key, selectedKeys.has(key)];
		}),
	) : undefined, [data, getKey, selectedKeys, isSelectionEnabled]);

	const locale = useLocale();

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		meta: {
			locale,
		},
		state: {
			rowSelection,
			sorting,
			globalFilter,
		},
		enableRowSelection: isSelectionEnabled,
		onSortingChange: setSorting,
		onRowSelectionChange: isSelectionEnabled ? (updater => {
			const newSelection = typeof updater === 'function' ? updater(rowSelection!) : updater;

			const newSelectedKeys = new Set<Key>();

			for (const [id, selected] of Object.entries(newSelection)) {
				if (selected) {
					newSelectedKeys.add(id);
				}
			}

			onSelectedKeysChange(newSelectedKeys);
		}) : undefined,
		getRowId: row => getKey(row).toString(),
	});

	let checked: 'indeterminate' | boolean = table.getIsAllRowsSelected();
	if (!checked) {
		checked = table.getIsSomeRowsSelected() ? 'indeterminate' : false;
	}

	return (
		<div className={className}>
			<table className='w-full h-full table-auto'>
				<thead className='border-stone-700 border-b'>
					{table.getHeaderGroups().map(headerGroup => (
						<tr key={headerGroup.id} className='text-stone-100'>
							{
								isSelectionEnabled && (
									<th className='w-16 group-hover:bg-stone-700 cursor-pointer'>
										<div className='flex items-center justify-center'>
											<Checkbox
												aria-label='Seleccionar todos'
												isSelected={checked !== 'indeterminate' && checked}
												isIndeterminate={checked === 'indeterminate'} onChange={() => {
													table.toggleAllRowsSelected();
												}}/>
										</div>
									</th>)
							}

							{headerGroup.headers.map(header => (
								<th
									key={header.id} className={cx(
										'py-3 text-left font-semibold text-sm hover:cursor-pointer',
										header.id === 'select' && 'w-fit',
									)}
									onClick={header.column.getToggleSortingHandler()}
								>

									{header.id === 'details'
										? flexRender(header.column.columnDef.header, header.getContext())
										: <div className='flex gap-2 items-center'>
											{header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
											{header.column.getIsSorted() === 'asc'
												? <Icon name='arrow_upward' size='sm'/> : null}
											{header.column.getIsSorted() === 'desc'
												? <Icon name='arrow_downward' size='sm'/> : null}
											{header.column.getIsSorted() === false ? <Icon name='sort' size='sm'/> : null}
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
							className='group rounded'
						>
							{
								isSelectionEnabled && (
									<td className='w-16 group-hover:bg-stone-700 cursor-pointer'>
										<div className='flex items-center justify-center'>
											<Checkbox
												aria-label='Seleccionar'
												isSelected={row.getIsSelected()}
												className='group-hover:border-stone-600 hover:bg-stone-600'
												onChange={() => {
													row.toggleSelected();
												}}/>
										</div>
									</td>
								)
							}

							{
								row.getVisibleCells().map(cell => (
									<td
										key={cell.id}
										className='cursor-pointer py-3 group-hover:bg-stone-700'
										onClick={cell.column.id !== 'información' && isSelectionEnabled ? row.getToggleSelectedHandler() : undefined}
									>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))
							}
							{
								getDetailsLink !== undefined && (
									<td className='cursor-pointer group-hover:bg-stone-700'>
										<Link href={getDetailsLink(row.original)}>
											<Button variant='text' color='tertiary' size='sm'>
												<Icon name='chevron_right'/>
											</Button>
										</Link>
									</td>
								)
							}
						</tr>
					))}
				</tbody>
			</table>
		</div>

	);
}

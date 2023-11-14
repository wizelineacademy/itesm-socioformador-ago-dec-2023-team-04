import {type ColumnHelper} from '@tanstack/table-core';
import React from 'react';
import Link from 'next/link';
import Checkbox from '@/components/checkbox.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';

export function selectColumn<T>(columnHelper: ColumnHelper<T>) {
	return columnHelper.display({
		id: 'select',
		header({table}) {
			let checked: 'indeterminate' | boolean = table.getIsAllRowsSelected();
			if (!checked) {
				checked = table.getIsSomeRowsSelected() ? 'indeterminate' : false;
			}

			return (
				<div className='flex items-center justify-center'>
					<Checkbox
						aria-label='Seleccionar todos'
						isSelected={checked !== 'indeterminate' && checked} isIndeterminate={checked === 'indeterminate'} onChange={() => {
							table.toggleAllRowsSelected();
						}}/>
				</div>
			);
		},
		cell: ({row}) => (
			<div className='flex items-center justify-center'>
				<Checkbox
					aria-label='Seleccionar'
					isSelected={row.getIsSelected()} className='group-hover:border-stone-600 hover:bg-stone-600'
					onChange={() => {
						row.toggleSelected();
					}}/>
			</div>
		),
	});
}

export function detailsLinkColumn<T>(columnHelper: ColumnHelper<T>, basePath: string) {
	return columnHelper.display({
		id: 'details',
		cell: info => (
			<Link href={`${basePath}/${info.row.id.toString()}`}>
				<Button variant='text' color='tertiary' size='sm' className='hover:bg-stone-400'>
					<Icon name='chevron_right'/>
				</Button>
			</Link>
		),
	});
}

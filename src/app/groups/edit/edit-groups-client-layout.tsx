'use client';
import React, {type Key, useState} from 'react';
import {type Group} from '@prisma/client';
import {useQuery, useQueryClient} from 'react-query';
import axios from 'axios';
import {createColumnHelper} from '@tanstack/table-core';
import Link from 'next/link';
import {useFormik} from 'formik';
import {toFormikValidate} from 'zod-formik-adapter';
import Spacer from '@/components/spacer.tsx';
import {Button} from '@/components/button.tsx';
import TopbarPageLayout from '@/components/topbar-page-layout.tsx';
import Icon from '@/components/icon.tsx';
import Table from '@/components/table.tsx';
import Checkbox from '@/components/checkbox.tsx';
import DeleteButton from '@/components/delete-button.tsx';
import TextField from '@/components/text-field.tsx';
import {type GroupCreation, groupCreationSchema} from '@/app/groups/edit/create/create-group-action.ts';

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
	columnHelper.accessor('id', {
		header: 'Información',
		cell: info => (
			<Link href={`/groups/edit/${info.getValue()}`}>
				<Button variant='text' color='tertiary' size='sm' className='hover:bg-stone-600'>
					<Icon name='chevron_right'/>
				</Button>
			</Link>
		),
	}),
];

export default function EditGroupsClientLayout({children, initialGroups}: {
	readonly initialGroups: Group[];
	readonly children: React.ReactNode;
}) {
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(new Set());

	const {data: groups} = useQuery('groups', async () => {
		const result = await axios.get<Group[]>('/api/groups');
		return result.data;
	}, {
		initialData: initialGroups,
		staleTime: 5000,
	});

	const deleteHandler = () => {
		console.log('deleted groups');
	};

	return (
		<TopbarPageLayout
			title='Grupos' topbarItems={
				<>
					<Spacer/>
					<DeleteButton label='¿Borrar grupos seleccionados?' isDisabled={selectedKeys.size === 0} onDelete={deleteHandler}/>
					<Link href='/groups/edit/create'>
						<Button color='secondary'>
							<Icon name='add'/>
						</Button>
					</Link>
					<TextField iconName='search' value={globalFilter} onChange={setGlobalFilter}/>
				</>
			}
		>
			<div className='flex gap-4'>
				<div className='bg-stone-800 grow rounded'>
					<Table
						data={groups ?? []} columns={columns}
						className='w-full'
						selectedKeys={selectedKeys} globalFilter={globalFilter}
						onSelectedKeysChange={setSelectedKeys}/>
				</div>
				<div className='w-72 bg-stone-800 h-full rounded p-4'>
					{children}
				</div>
			</div>
		</TopbarPageLayout>
	);
}

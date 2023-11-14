'use client';
import React, {type Key, type ReactNode, useState} from 'react';
import {createColumnHelper} from '@tanstack/table-core';
import Link from 'next/link';
import Spacer from '@/components/spacer.tsx';
import {Button} from '@/components/button.tsx';
import TopbarPageLayout from '@/components/topbar-page-layout.tsx';
import Icon from '@/components/icon.tsx';
import Table from '@/components/table.tsx';
import DeleteButton from '@/components/delete-button.tsx';
import TextField from '@/components/text-field.tsx';
import {detailsLinkColumn, selectColumn} from '@/components/table-columns.tsx';
import {deleteGroups} from '@/lib/actions/group.ts';
import {type GroupWithStudentCount} from '@/lib/group.ts';

const columnHelper = createColumnHelper<GroupWithStudentCount>();

const columns = [
	selectColumn(columnHelper),
	columnHelper.accessor('name', {
		header: 'Nombre',
		cell: info => info.getValue(),
	}),
	columnHelper.accessor('_count.students', {
		header: '# de alumnos',
		cell(info) {
			return info.getValue();
		},
	}),
	columnHelper.accessor('active', {
		header: 'Estado',
		cell(info) {
			return info.getValue() ? 'Activo' : 'Inactivo';
		},
	}),
	detailsLinkColumn(columnHelper, '/groups/edit/'),
];

export type EditGroupsClientLayoutProps = {
	readonly children: ReactNode;
	readonly groups: GroupWithStudentCount[];
};

export default function EditGroupsClientLayout(props: EditGroupsClientLayoutProps) {
	const {children, groups} = props;
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(new Set());

	const deleteHandler = async () => {
		const result = await deleteGroups([...selectedKeys].map(key => Number.parseInt(key.toString(), 10)));
		if (result.success) {
			setSelectedKeys(new Set());
		}
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
					<TextField aria-label='Buscar' iconName='search' value={globalFilter} onChange={setGlobalFilter}/>
				</>
			}
		>
			<div className='flex gap-4'>
				<div className='bg-stone-800 grow rounded'>
					<Table
						data={groups} columns={columns}
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

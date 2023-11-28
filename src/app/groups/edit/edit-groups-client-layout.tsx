'use client';
import React, {type ReactNode, useState} from 'react';
import {createColumnHelper} from '@tanstack/table-core';
import Link from 'next/link';
import {type Key} from 'react-stately';
import Spacer from '@/components/spacer.tsx';
import {Button} from '@/components/button.tsx';
import TopBarPageTemplate from '@/components/top-bar-page-template.tsx';
import Icon from '@/components/icon.tsx';
import Table from '@/components/table.tsx';
import DeleteButton from '@/components/delete-button.tsx';
import TextField from '@/components/text-field.tsx';
import {deleteGroups, type GroupWithStudentCount} from '@/lib/groups.ts';

const columnHelper = createColumnHelper<GroupWithStudentCount>();

const columns = [
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
];

export type EditGroupsClientLayoutProps = {
	readonly children: ReactNode;
	readonly groups: GroupWithStudentCount[];
	readonly action: (groups: number[]) => Promise<void>;
};

export default function EditGroupsClientLayout(props: EditGroupsClientLayoutProps) {
	const {
		children,
		groups,
		action,
	} = props;

	const [globalFilter, setGlobalFilter] = useState<string>('');
	const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(new Set());

	const deleteHandler = async () => {
		await action([...selectedKeys].map(key => Number.parseInt(key.toString(), 10)));
	};

	return (
		<TopBarPageTemplate
			title='Grupos' topBarItems={
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
						getDetailsLink={group => `/groups/edit/${group.id}`} onSelectedKeysChange={setSelectedKeys}/>
				</div>
				<div className='w-72 bg-stone-800 h-full rounded p-4'>
					{children}
				</div>
			</div>
		</TopBarPageTemplate>
	);
}

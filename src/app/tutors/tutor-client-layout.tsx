'use client';
import React, {useState} from 'react';
import Link from 'next/link';
import {type Tutor} from '@prisma/client';
import {createColumnHelper} from '@tanstack/table-core';
import {type Key} from 'react-stately';
import Spacer from '@/components/spacer.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import Table from '@/components/table.tsx';
import DeleteButton from '@/components/delete-button.tsx';
import TextField from '@/components/text-field.tsx';
import TopbarPageTemplate from '@/components/top-bar-page-template.tsx';
import {useToasts} from '@/components/toast.tsx';

const columnHelper = createColumnHelper<Tutor>();

const columns = [
	columnHelper.accessor('givenName', {
		header: 'Nombre(s)',
		cell: info => info.getValue(),
	}),
	columnHelper.accessor('familyName', {
		header: 'Apellidos(s)',
		cell: info => info.getValue(),
	}),
	columnHelper.accessor('email', {
		header: 'Correo',
		cell: info => info.getValue(),
	}),
	columnHelper.accessor('phoneNumber', {
		header: 'Número',
		cell: info => info.getValue(),
	}),
];

export type TutorClientLayoutProps = {
	readonly tutors: Tutor[];
	readonly children: React.ReactNode;
	readonly action: (tutors: number[]) => Promise<number>;
};

export default function TutorClientLayout(props: TutorClientLayoutProps) {
	const {tutors, children, action} = props;
	const [globalFilter, setGlobalFilter] = useState<string>('');

	const [selectedKeys, setSelectedKeys] = useState<Set<Key>>(new Set());

	const {add} = useToasts();

	const handleDelete = async () => {
		try {
			const count = await action([...selectedKeys].map(key => Number.parseInt(key.toString(), 10)));
			add({
				title: `${count} tutor${count === 1 ? '' : 'es'} eliminado${count === 1 ? '' : 's'}.`,
			});
		} catch (error) {
			add({
				variant: 'error',
				title: 'Error al borrar los tutores.',
				description: error instanceof Error ? error.message : undefined,
			}, {
				timeout: 5000,
			});
		}
	};

	return (
		<TopbarPageTemplate
			title='Tutores' topBarItems={
				<>
					<Spacer/>
					<DeleteButton label='¿Borrar los registros seleccionados?' isDisabled={selectedKeys.size === 0} onDelete={handleDelete}/>
					<Link href='/tutors/create'>
						<Button color='secondary'><Icon name='add'/></Button>
					</Link>
					<TextField aria-label='Buscar' iconName='search' value={globalFilter} onChange={setGlobalFilter}/>
				</>
			}
		>
			<div className='flex gap-4'>
				<div className='bg-stone-800 grow rounded'>
					<Table
						className='w-full' data={tutors ?? []} columns={columns}
						selectedKeys={selectedKeys} globalFilter={globalFilter}
						getDetailsLink={tutor => `/tutors/${tutor.id}`} onSelectedKeysChange={setSelectedKeys}/>
				</div>
				<div className='w-72 sticky bg-stone-800 h-fit rounded p-4 top-4'>
					{children}
				</div>
			</div>
		</TopbarPageTemplate>
	);
}

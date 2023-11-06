'use client';
import React, {useState} from 'react';
import Link from 'next/link';
import {type Student} from '@prisma/client';
import * as Popover from '@radix-ui/react-popover';
import {useQueryClient} from 'react-query';
import Spacer from '@/components/spacer.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import StudentsTable from '@/app/students/students-table.tsx';
import deleteStudent from '@/app/students/delete-students-action.ts';
import SearchBar from '@/components/search-bar.tsx';

function DeleteButton({confirmationMessage, onPress, ...props}: {readonly onPress: () => void;readonly confirmationMessage: string} & Omit<React.ComponentProps<typeof Button>, 'color' | 'children'>) {
	return (
		<Popover.Root>
			<Popover.Trigger asChild>
				<Button {...props} color='destructive'> <Icon
					name='delete'/>
				</Button>
			</Popover.Trigger>
			<Popover.Portal>
				<Popover.Content align='end'>
					<Popover.Arrow className='fill-stone-700'/>
					<div className='bg-stone-700 p-4 w-48 rounded'>
						<p className='text-stone-200 mb-2 text-sm'>
							{confirmationMessage}
						</p>
						<Button color='destructive' size='sm' onPress={onPress}> Borrar </Button>
					</div>
				</Popover.Content>
			</Popover.Portal>
		</Popover.Root>
	);
}

export default function StudentClientLayout({children, initialStudents}: {
	readonly initialStudents: Student[];
	readonly children: React.ReactNode;
}) {
	const [studentSelection, setStudentSelection] = useState<Record<string, boolean>>({});
	const [globalFilter, setGlobalFilter] = useState<string>('');
	const queryClient = useQueryClient();

	const handleDeleteClick = async () => {
		const result = await deleteStudent(Object.entries(studentSelection).filter(([, value]) => value).map(([key]) => Number.parseInt(key, 10)));

		await queryClient.invalidateQueries('students');

		console.log(result);
	};

	return (
		<div className='flex flex-col h-full text-stone-400 '>
			<div className='flex items-top mb-4 gap-4'>
				<h1 className='text-4xl'>
					Alumnos
				</h1>
				<Spacer/>
				<SearchBar value={globalFilter} onChange={setGlobalFilter}/>
				<div className='w-72 flex gap-4 justify-end'>
					<DeleteButton confirmationMessage='¿Borrar los registros seleccionados?' isDisabled={Object.keys(studentSelection).length === 0} onPress={handleDeleteClick}/>
					<Link href='/students/create'>
						<Button color='secondary'><Icon name='add'/></Button>
					</Link>
				</div>
			</div>

			<div className='flex gap-4 grow'>
				<div className='bg-stone-800 grow rounded'>
					<StudentsTable
						globalFilter={globalFilter}
						initialStudents={initialStudents} className='w-full'
						studentSelection={studentSelection} onStudentSelectionChange={setStudentSelection}/>
				</div>
				<div className='w-72 bg-stone-800 h-full rounded p-4'>
					{children}
				</div>
			</div>
		</div>
	);
}

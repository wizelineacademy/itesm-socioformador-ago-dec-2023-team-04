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

export default function StudentClientLayout({children, initialStudents}: {
	readonly initialStudents: Student[];
	readonly children: React.ReactNode;
}) {
	const [studentSelection, setStudentSelection] = React.useState<Record<string, boolean>>({});
	const queryClient = useQueryClient();

	const handleDeleteClick = async () => {
		const result = await deleteStudent(Object.entries(studentSelection).filter(([, value]) => value).map(([key]) => Number.parseInt(key, 10)));

		await queryClient.invalidateQueries('users');

		console.log(result);
	};

	return (
		<div className='flex flex-col h-full text-stone-400 p-16'>
			<div className='flex items-top mb-4 gap-4'>
				<h1 className='text-4xl'>
					Alumnos
				</h1>
				<SearchBar/>
				<Spacer/>
				<Popover.Root>
					<Popover.Trigger asChild>
						<Button variant='destructive' disabled={Object.keys(studentSelection).length === 0}> <Icon
							name='delete'/>
						</Button>
					</Popover.Trigger>
					<Popover.Portal>
						<Popover.Content align='end'>
							<Popover.Arrow className='fill-stone-700'/>
							<div className='bg-stone-700 p-4 w-48 rounded'>
								<p className='text-stone-200 mb-2 text-sm'>
									¿Borrar los registros seleccionados?
								</p>
								<Button variant='destructive' size='sm' onClick={handleDeleteClick}> Borrar </Button>
							</div>
						</Popover.Content>
					</Popover.Portal>
				</Popover.Root>
				<Link href='/students/create'>
					<Button variant='secondary'><Icon name='add'/></Button>
				</Link>
			</div>

			<div className='flex gap-4 h-full'>
				<div className='bg-stone-800 grow rounded'>
					<StudentsTable
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

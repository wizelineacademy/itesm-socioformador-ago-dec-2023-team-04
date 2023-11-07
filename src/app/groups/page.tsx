import React from 'react';
import {type Group} from '@prisma/client';
import Link from 'next/link';
import {getAllGroups} from '@/lib/group.ts';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import TopbarPageLayout from '@/components/topbar-page-layout.tsx';
import Spacer from '@/components/spacer.tsx';

type GroupCardProps = {
	readonly group: Group;
};

function GroupCard(props: GroupCardProps) {
	const {group} = props;
	return (
		<div className='mr-2 block rounded-sm bg-stone-800 shrink-0 h-36'>
			<div className='p-6'>
				<h5 className='mb-2 text-xl font-medium leading-tight text-center text-gray-200'>
					{group.name}
				</h5>
				<div className='flex items-center justify-center text-gray-300'>
					<p className='mb-2 text-base mr-28'>asd</p>
					<p className='mb-2 text-base'>asdf</p>
				</div>
				<div className='flex items-center justify-center text-stone-400'>
					<p className='mb-2 text-base mr-12'>Alumnos</p>
					<p className='mb-2 text-base'>Profesor(es)</p>
				</div>
			</div>
		</div>
	);
}

export default async function GroupsPage() {
	const groups = await getAllGroups();
	// Const client = useClient();

	// const [groupName, setGroupName] = useState('');
	// const [groupColor, setGroupColor] = useState('');
	// const [isAddingGroup, setIsAddingGroup] = useState(false);
	//
	// const handleAddGroup = () => {
	// 	setIsAddingGroup(true);
	// };
	//
	// const handleSubmit = (e: React.FormEvent) => {
	// 	e.preventDefault();
	// 	// Create a new group object with name and color
	// 	const newGroup = {
	// 		groupName,
	// 		numStudents: 0, // Student Values
	// 		numProfessors: 0, // Professor Values
	// 		groupColor,
	// 	};
	// 	// Update the groups state with the new group
	// 	// Reset the form fields and close the form
	// 	setGroupName('');
	// 	setGroupColor('');
	// 	setIsAddingGroup(false);
	// };

	return (
		<TopbarPageLayout
			title='Grupos' topbarItems={
				<>
					<Spacer/>
					<Link href='/groups/edit'>
						<Button color='secondary'>
							<Icon name='edit'/>
						</Button>
					</Link>
				</>

			}
		>
			<div className='flex gap-4'>
				{
					groups.map(group => (
						<GroupCard key={group.id} group={group}/>
					))
				}
			</div>
		</TopbarPageLayout>

	);
}

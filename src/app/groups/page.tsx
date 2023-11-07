import React from 'react';
import {type Group} from '@prisma/client';
import Link from 'next/link';
import {getAllGroups} from '@/lib/group.ts';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';

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
		<main>
			<div className='flex gap-4 justify-between'>
				<h1 className='text-4xl mb-4 text-slate-200'>Grupos</h1>
				<Link href='/groups/edit'>
					<Button color='secondary'>
						<Icon name='edit'/>
					</Button>
				</Link>
			</div>
			<div className='flex gap-4'>
				{
					groups.map(group => (
						<GroupCard key={group.id} group={group}/>
					))
				}
			</div>
			{/* <div className='justify-center'> */}
			{/* 	<button className='mb-4' onClick={handleAddGroup}> */}
			{/* 		Add Group */}
			{/* 	</button> */}

			{/* 	/!* Render the form when isAddingGroup is true *!/ */}
			{/* 	{isAddingGroup && ( */}
			{/* 		<form onSubmit={handleSubmit}> */}
			{/* 			<label> */}
			{/* 				Group Name: */}
			{/* 				<input */}
			{/* 					type='text' */}
			{/* 					value={groupName} */}
			{/* 					onChange={e => { */}
			{/* 						setGroupName(e.target.value); */}
			{/* 					}} */}
			{/* 				/> */}
			{/* 			</label> */}
			{/* 			<label> */}
			{/* 				Group Color: */}
			{/* 				<input */}
			{/* 					type='text' */}
			{/* 					value={groupColor} */}
			{/* 					onChange={e => { */}
			{/* 						setGroupColor(e.target.value); */}
			{/* 					}} */}
			{/* 				/> */}
			{/* 			</label> */}
			{/* 			<button type='submit'>Submit</button> */}
			{/* 		</form> */}
			{/* 	)} */}

			{/* 	<div className='grid grid-cols-1 grid-rows-1 md:grid-cols-4 flex-1 h-36 w-364'> */}
			{/* 		/!* Map through the groups and render GroupCard components *!/ */}
			{/* 		{groups.map((group, index) => ( */}
			{/* 			<GroupCard */}
			{/* 				key={index} */}
			{/* 				groupName={group.groupName} */}
			{/* 				numStudents={group.numStudents} */}
			{/* 				numProfessors={group.numProfessors} */}
			{/* 			/> */}
			{/* 		))} */}
			{/* 	</div> */}
			{/* </div> */}
		</main>
	);
}

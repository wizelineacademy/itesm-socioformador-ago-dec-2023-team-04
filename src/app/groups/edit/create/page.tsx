import React from 'react';
import {getAllColors} from '@/lib/color.ts';
import GroupForm from '@/app/groups/edit/group-form.tsx';

export default async function CreateGroupPage() {
	const colors = await getAllColors();
	return (
		<>
			<h1 className='text-stone-200 text-lg'>
				Nuevo grupo
			</h1>
			<GroupForm colors={colors}/>
		</>
	);
}

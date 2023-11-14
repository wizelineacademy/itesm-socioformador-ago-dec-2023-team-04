import React from 'react';
import CreateGroupForm from '@/app/groups/edit/create/create-group-form.tsx';
import {getAllColors} from '@/lib/color.ts';

export default async function CreateGroupPage() {
	const colors = await getAllColors();
	return (
		<>
			<h1 className='text-stone-200 text-lg'>
				Nuevo grupo
			</h1>
			<CreateGroupForm colors={colors}/>
		</>
	);
}

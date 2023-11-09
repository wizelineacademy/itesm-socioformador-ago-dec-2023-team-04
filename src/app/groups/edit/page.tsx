import React from 'react';
import {type Group} from '@prisma/client';
import Icon from '@/components/icon.tsx';

export default function EditGroupsPage() {
	return (
		<div className='flex flex-col gap-1 items-center text-center my-4'>
			<Icon name='groups'/>
			Selecciona un grupo para ver sus detalles.
		</div>
	);
}

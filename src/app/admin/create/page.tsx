import React from 'react';
import UserCreationForm from '@/app/admin/create/user-creation-form.tsx';

export default function UsersPage() {
	return (
		<div className='w-full'>
			<h2 className='text-2xl mb-4'>
				Creación de usuario
			</h2>
			<UserCreationForm className='w-full'/>
		</div>

	);
}

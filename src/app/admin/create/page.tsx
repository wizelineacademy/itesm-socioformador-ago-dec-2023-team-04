import React from 'react';
import UserForm from '@/app/admin/users/user-form.tsx';

export default function UsersPage() {
	return (
		<div className='w-full'>
			<h2 className='text-2xl mb-4'>
				Creación de usuario
			</h2>
			<UserForm/>
		</div>

	);
}

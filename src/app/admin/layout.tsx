import React from 'react';
import AdminNavigationLink from '@/components/admin-navigation-link.tsx';

export default function AdminLayout({children}: {
	readonly children: React.ReactNode;
}) {
	return (
		<div className='flex w-full justify-center text-stone-300 px-4'>
			<main className='w-full max-w-5xl flex py-8 gap-4'>
				<nav className='basis-48 flex-none flex flex-col gap-2'>
					<AdminNavigationLink>
						Configuración general
					</AdminNavigationLink>
					<AdminNavigationLink slug='users'>
						Usuarios
					</AdminNavigationLink>
				</nav>
				<div className='grow'>
					{children}
				</div>
			</main>
		</div>
	);
}

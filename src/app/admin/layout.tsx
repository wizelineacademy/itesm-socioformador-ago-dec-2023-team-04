import React from 'react';
import AdminNavigationLink from '@/components/admin-navigation-link.tsx';

export default function AdminLayout({children}: {
	readonly children: React.ReactNode;
}) {
	return (
		<main className='flex h-full justify-center text-stone-300'>
			<nav className='basis-32 flex-none flex flex-col gap-2 mt-14'>
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
	);
}

import React from 'react';
import AdminNavigationLink from '@/components/admin-navigation-link.tsx';

export default function AdminLayout({children}: {
	readonly children: React.ReactNode;
}) {
	return (
		<div className='flex w-full justify-center text-stone-300 px-4 min-h-screen'>
			<main className='w-full max-w-8xl flex py-8 gap-4'>
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
		</div>
	);
}

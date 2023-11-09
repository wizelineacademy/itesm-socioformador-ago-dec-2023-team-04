import React from 'react';
import type {Metadata} from 'next';
import Link from 'next/link';
import {Source_Sans_3} from 'next/font/google';
import Image from 'next/image';
import Logo from './logo_full-nobg_196.png';
import '@/app/globals.css';
import ClientProviders from '@/components/client-providers.tsx';
import {SidebarButton} from '@/components/sidebar-button.tsx';
import AccountSidebarButton from '@/components/account-sidebar-button.tsx';
import {getUserFromSession} from '@/lib/user.ts';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';

const sourceSans = Source_Sans_3({
	subsets: ['latin'],
	variable: '--font-source-sans',
});

export const metadata: Metadata = {
	title: 'Create Next App',
	description: 'Generated by create next app',
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getUserFromSession();
	return (
		<html lang='es' className={sourceSans.variable}>
			<ClientProviders>
				<body className='bg-stone-900 min-w-full h-screen'>
					<div className='bg-stone-800 h-full fixed flex flex-col w-48 p-4 justify-start items-center'>
						<Image src={Logo} width={128} alt='logo' className='mt-2 mb-4'/>
						<nav className='flex flex-col h-full w-full'>
							<SidebarButton href='/'>
								<Icon name='home' className='me-2'/>
								Inicio
							</SidebarButton>
							<SidebarButton href='/groups'>
								<Icon name='groups' className='me-2'/>
								Grupos
							</SidebarButton>
							<SidebarButton href='/students'>
								<Icon name='school' className='me-2'/>
								Alumnos
							</SidebarButton>
							<SidebarButton href='/statistics'>
								<Icon name='bar_chart' className='me-2'/>
								Estadísticas
							</SidebarButton>
							<SidebarButton href='/notifications'>
								<Icon name='notifications' className='me-2'/>
								Notificaciones
							</SidebarButton>
							<div className='grow'/>
							<AccountSidebarButton>
								<p className='text-stone-300 text-lg'>
									{`${user.givenName} ${user.familyName}`}
								</p>
								<p className='text-xs mb-2'>
									{user.email}
								</p>
								<Link href='/account'>
									<Button size='xs' variant='text' color='secondary' className='mb-2' href='/account'>
										Opciones de cuenta
									</Button>
								</Link>
								<a href='/api/auth/logout'>
									<Button size='xs' variant='contained' color='secondary'>
										Cerrar sesión
									</Button>
								</a>
							</AccountSidebarButton>
							<SidebarButton href='/assistance' className='w-full'>
								<Icon name='photo_camera' className='me-2'/>
								Asistencia
							</SidebarButton>
							{
								user.admin
									? <SidebarButton href='/admin' className='w-full'> <Icon name='admin_panel_settings' className='me-2'/>Administración</SidebarButton> : null
							}
						</nav>
					</div>
					<div className='ml-48 min-h-screen'>
						{children}
					</div>

				</body>
			</ClientProviders>
		</html>
	);
}

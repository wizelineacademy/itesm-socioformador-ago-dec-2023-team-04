'use client';

import React from 'react';
import Link from 'next/link';
import {type User} from '@prisma/client';
import {SidebarButton} from '@/components/sidebar-button.tsx';
import Icon from '@/components/icon.tsx';
import AccountSidebarButton from '@/components/account-sidebar-button.tsx';
import {Button} from '@/components/button.tsx';

export type SidebarNavProps = {
	readonly user: User;
};

export default function SidebarNav(props: SidebarNavProps) {
	const {user} = props;
	return (
		<nav className='flex flex-col h-full w-full'>
			<SidebarButton href='/'>
				<Icon name='home' className='me-2'/>
				Inicio
			</SidebarButton>
			<SidebarButton href='/groups'>
				<Icon name='groups' className='me-2'/>
				Grupos
			</SidebarButton>
			{user.admin
				? <SidebarButton href='/students'>
					<Icon name='school' className='me-2'/>
					Alumnos
				</SidebarButton> : null}
			<SidebarButton href='/statistics'>
				<Icon name='bar_chart' className='me-2'/>
				Estadísticas
			</SidebarButton>
			{user.admin
				? <SidebarButton href='/notifications'>
					<Icon name='notifications' className='me-2'/>
					Notificaciones
				</SidebarButton> : null}

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
	);
}

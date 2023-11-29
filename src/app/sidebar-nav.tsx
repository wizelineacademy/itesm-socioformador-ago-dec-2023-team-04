'use client';
import React from 'react';
import {type User} from '@prisma/client';
import {SidebarButton} from '@/components/sidebar-button.tsx';
import Icon from '@/components/icon.tsx';
import ButtonPopoverTrigger from '@/components/button-popover-trigger.tsx';
import LinkButton from '@/components/link-button.tsx';

export type SidebarNavProps = {
	readonly user: User;
};

export default function SidebarNav(props: SidebarNavProps) {
	const {user} = props;
	return (
		<nav className='flex flex-col h-full w-full fill-stone-50'>
			<SidebarButton href='/groups'>
				<Icon name='groups' className='me-2'/>
				Grupos
			</SidebarButton>
			{user.admin
				? <SidebarButton href='/students'>
					<Icon name='school' className='me-2'/>
					Alumnos
				</SidebarButton> : null}
			<SidebarButton href='/tutors'>
				<Icon name='supervisor_account' className='me-2'/>
				Tutores
			</SidebarButton>
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
			<ButtonPopoverTrigger
				variant='text' color='tertiary'
				label={<>
					<Icon name='account_circle' className='me-2'/>
					Mi cuenta
				</>}
			>
				<div className='p-4'>
					<p className='text-stone-300 text-lg'>
						{`${user.givenName} ${user.familyName}`}
					</p>
					<p className='text-xs text-stone-300 mb-2'>
						{user.email}
					</p>
					<LinkButton href='/account' size='sm' variant='text' color='secondary' className='mb-2'>
						Opciones de cuenta
					</LinkButton>
					<LinkButton href='/api/auth/logout' size='sm' variant='contained' color='secondary'>
						Cerrar sesión
					</LinkButton>
				</div>
			</ButtonPopoverTrigger>
			<SidebarButton href='/assistance' className='w-full'>
				<Icon name='photo_camera' className='me-2'/>
				Asistencia
			</SidebarButton>
			{
				user.admin
					? <SidebarButton href='/users' className='w-full'> <Icon name='manage_accounts' className='me-2'/>Usuarios</SidebarButton> : null
			}
		</nav>
	);
}

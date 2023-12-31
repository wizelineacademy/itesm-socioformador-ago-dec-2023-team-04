import React from 'react';
import type {Metadata} from 'next';
import {Source_Sans_3} from 'next/font/google';
import Image from 'next/image';
import Logo from 'public/logo_full.png';
import '@/app/globals.css';
import ClientProviders from '@/components/client-providers.tsx';
import {getUserFromSession} from '@/lib/users.ts';
import SidebarNav from '@/app/sidebar-nav.tsx';
import {ToastProvider} from '@/components/toast.tsx';

const sourceSans = Source_Sans_3({
	subsets: ['latin'],
	variable: '--font-source-sans',
});

export const metadata: Metadata = {
	title: 'SATS',
	description: 'metaphora. Student Attendance Tracking System',
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const user = await getUserFromSession();
	if (user === null) {
		throw new Error('User not found');
	}

	return (
		<html
			lang='es' className={sourceSans.variable}
		>
			<ClientProviders>
				<body className='bg-stone-900 min-w-full min-h-screen'>
					<ToastProvider>
						<div className='bg-stone-800 h-full fixed flex flex-col w-48 p-4 justify-start items-center'>
							<Image src={Logo} width={128} alt='logo' className='mt-2 mb-4'/>
							<SidebarNav user={user}/>
						</div>
						<div className='ml-48 min-h-screen'>
							{children}
						</div>
					</ToastProvider>
				</body>
			</ClientProviders>
		</html>
	);
}

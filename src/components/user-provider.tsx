'use client';
import React from 'react';
import {UserProvider as BaseUserProvider} from '@auth0/nextjs-auth0/client';

export default function UserProvider({children}: {readonly children: React.ReactNode}) {
	return (
		<BaseUserProvider>
			{children}
		</BaseUserProvider>
	);
}

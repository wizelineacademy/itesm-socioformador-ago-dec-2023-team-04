'use client';

import React from 'react';
import Link from 'next/link';
import Spacer from '@/components/spacer.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';

export default function GroupsTopBarItems() {
	return (
		<>
			<Spacer/>
			<Link href='/groups/edit'>
				<Button color='secondary'>
					<Icon name='edit'/>
				</Button>
			</Link>
		</>
	);
}

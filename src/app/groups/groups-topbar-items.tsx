'use client';

import React from 'react';
import {type User} from '@prisma/client';
import Link from 'next/link';
import Spacer from '@/components/spacer.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';

export type TopbarProps = {
	readonly user: User;
};

export default function GroupsTopBarItems(props: TopbarProps) {
	const {user} = props;
	return (
		<>
			<Spacer/>
			{user.admin
				? <Link href='/groups/edit'>
					<Button color='secondary'>
						<Icon name='edit'/>
					</Button>
				</Link> : null}
		</>

	);
}

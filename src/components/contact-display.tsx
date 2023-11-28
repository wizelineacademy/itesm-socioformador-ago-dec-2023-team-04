import React from 'react';
import {notFound} from 'next/navigation';
import clsx from 'clsx';
import Icon from '@/components/icon.tsx';
import {getTutorById} from '@/lib/tutors.ts';

type TutorContactInfoProps = {
	readonly infoId: number;
	readonly className?: string;
};

export default async function ContactDisplay({infoId, className}: TutorContactInfoProps) {
	const info = await getTutorById(infoId);

	if (info === null) {
		notFound();
	}

	return (
		<div className={clsx('flex rounded bg-stone-700 w-full justify-items-stretch p-3 mb-4', className)}>
			<div className='grid grid-rows-2 grid-cols-1 w-full text-xs text-stone-300 content-center items-center align-middle'>
				<div className='text-base text-stone-100'>
					{info.givenName} {info.familyName}
				</div>
				<div className='text-base'>
					<Icon name='phone' size='xs'/>
					{info.phoneNumber}
				</div>
			</div>
		</div>
	);
}

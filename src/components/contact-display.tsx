import React from 'react';
import {notFound} from 'next/navigation';
import clsx from 'clsx';
import Icon from '@/components/icon.tsx';
import {getTutorById} from '@/lib/tutor.ts';

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
		<div className={clsx('flex rounded bg-stone-700 w-full justify-items-stretch p-3', className)}>
			<div className='grid grid-rows-3 grid-cols-2 w-full text-xs text-stone-300 content-center items-center align-middle'>
				<div className='col-span-2 text-xl text-stone-100'>
					Tutor
				</div>
				<div className='text-sm'>{info.givenName}</div>
				<div className='text-right'>
					<Icon name='phone'/>
					{info.phoneNumber}
				</div>
				<div className='text-sm'>{info.familyName}</div>
				<div className='text-right'>
					<Icon name='mail'/>
					{info.email}
				</div>
			</div>
		</div>
	);
}

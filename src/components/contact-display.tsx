import React from 'react';
import {notFound} from 'next/navigation';
import Icon from '@/components/icon.tsx';
import {getTutorById} from '@/lib/tutor.ts';

export default async function TutorContactInfo(infoId: number) {
	const info = await getTutorById(infoId);

	if (info === null) {
		notFound();
	}

	return (
		<div className='flex rounded bg-stone-700 w-full justify-items-stretch p-6'>
			<div className='grid grid-rows-3 grid-cols-2 w-full text-base text-stone-300 content-center items-center'>
				<div className='col-span-2 text-xl text-stone-100'>
					Tutor
				</div>
				<div>`${info.id}`</div>
				<div className='text-right'>
					<Icon name='phone'/>
					`${info.phoneNumber}`
				</div>
				<div>`${info.familyName}`</div>
				<div className='text-right'>
					<Icon name='mail'/>
					`${info.email}`
				</div>
			</div>
		</div>
	);
}

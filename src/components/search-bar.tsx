'use client';
import React, {useState} from 'react';
import Icon from '@/components/icon.tsx';

export default function SearchBar() {
	const [filtering, setFiltering] = useState('');
	return (
		<div className='bg-stone-700 rounded flex items-center p-2.5 gap-2.5'>
			<Icon name='search' className='text-stone-400'/>
			<input
				type='text' className='bg-stone-700'
				placeholder='Buscar'
				value={filtering}
				onChange={event => {
					setFiltering(event.target.value);
				}}/>
			<div className='bg-stone-800 text-stone-400 rounded align-middle'>ctrl K</div>
		</div>
	);
}


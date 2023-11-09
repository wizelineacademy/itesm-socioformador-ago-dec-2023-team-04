import React from 'react';
import Icon from '@/components/icon.tsx';
import {Input} from '@/components/input.tsx';

export default function SearchBar({value, onChange}: {readonly value: string; readonly onChange: (newValue: string) => void}) {
	return (
		<div className='bg-stone-700 h-fit rounded flex items-center px-2 gap-1'>
			<Icon name='search' className='text-stone-400'/>
			<Input
				type='text' className='bg-stone-700 h-fit border-none'
				placeholder='Buscar'
				value={value}
				onChange={event => {
					onChange(event.target.value);
				}}/>
			<div className='bg-stone-800 text-stone-400 rounded align-middle text-sm py-1 px-2'>ctrl K</div>
		</div>
	);
}


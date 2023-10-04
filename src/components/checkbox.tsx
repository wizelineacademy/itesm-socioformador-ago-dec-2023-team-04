'use client';
import React from 'react';
import * as BaseCheckbox from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import Icon from '@/components/icon.tsx';

export default function Checkbox({className, ...props}: {readonly className?: string} & BaseCheckbox.CheckboxProps) {
	return (
		<BaseCheckbox.Root {...props} className={clsx('w-6 h-6 rounded border-stone-700 border relative hover:bg-stone-700', className)}>
			<BaseCheckbox.Indicator className='group'>
				<Icon name='check' className='leading-none group-data-[state=indeterminate]:hidden text-wRed-400'/>
				<Icon name='check_indeterminate_small' className='text-md group-data-[state=checked]:hidden text-wRed-400'/>
			</BaseCheckbox.Indicator>
		</BaseCheckbox.Root>
	);
}

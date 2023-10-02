import React from 'react';
import * as BaseCheckbox from '@radix-ui/react-checkbox';
import clsx from 'clsx';
import Icon from '@/components/icon.tsx';

export default function Checkbox({className}: {readonly className?: string}) {
	return (
		<BaseCheckbox.Root className={clsx('w-6 h-6 rounded border-stone-700 border', className)}>
			<BaseCheckbox.Indicator asChild>
				<Icon name='check' className='text-sm w-2 h-2'/>
			</BaseCheckbox.Indicator>
		</BaseCheckbox.Root>
	);
}

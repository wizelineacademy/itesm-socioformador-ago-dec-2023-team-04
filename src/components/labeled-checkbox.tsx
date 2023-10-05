import React from 'react';
import clsx from 'clsx';
import Checkbox from '@/components/checkbox.tsx';

export default function LabeledCheckbox({className, label, ...props}: {readonly className?: string; readonly label: string} & React.ComponentProps<typeof Checkbox>) {
	return (
		<div className={clsx('flex gap-2 items-center', className)}>
			<p className='text-sm'>
				{label}
			</p>
			<Checkbox {...props}/>
		</div>
	);
}


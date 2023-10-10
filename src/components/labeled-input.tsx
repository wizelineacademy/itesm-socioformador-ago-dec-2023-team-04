import React from 'react';
import {Input} from '@/components/input.tsx';

export const LabeledInput = React.forwardRef(
	({className, label, issueText, required, ...props}: {readonly label: string; readonly issueText?: string} & React.ComponentProps<typeof Input>, ref) => (
		<div className={className}>
			<p className='text-xs mb-1'>
				{label}  {required ? '*' : null}
			</p>
			<Input required={required} {...props}/>
			{issueText === undefined
				? null
				: <p className='text-xs text-wRed-200 mt-1'>{issueText}</p>}
		</div>
	));

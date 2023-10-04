import React from 'react';
import {Input as BaseInput, type InputProps} from '@mui/base/Input';

export const LabeledInput = React.forwardRef(
	({className, label, issueText, required, ...props}: {readonly className?: string; readonly label: string; readonly issueText?: string} & InputProps, ref) => (
		<div className={className}>
			<p className='text-xs mb-1'>
				{label}  {required ? '*' : null}
			</p>
			<BaseInput
				{...props} slotProps={{
					input: {
						className: 'bg-stone-700 rounded border-stone-600 border p-1 w-full',
					},
				}}/>
			{issueText === undefined
				? null
				: <p className='text-xs text-wRed-200 mt-1'>{issueText}</p>}
		</div>
	));

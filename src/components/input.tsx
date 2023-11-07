import React from 'react';
import {Input as BaseInput, type InputProps} from '@mui/base/Input';
import clsx from 'clsx';

export const Input = React.forwardRef(({
	className,
	...props
}: InputProps, ref: React.ForwardedRef<HTMLInputElement>) => (
	<BaseInput
		{...props} slotProps={{
			input: {
				className: clsx('bg-stone-700 rounded text-base border-stone-600 border p-1 w-full focus:outline-none placeholder:text-stone-500', className),
			},
		}}/>
));

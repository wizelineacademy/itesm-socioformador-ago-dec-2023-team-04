'use client';
import React from 'react';
import {Button as BaseButton, type ButtonProps} from '@mui/base';
import clsx from 'clsx';

export const Button = React.forwardRef(
	({
		className,
		size = 'md',
		variant = 'primary',
		children,
		disabled,
		...props
	}: {
		readonly size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
		readonly variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive';
	} & ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => (
		<BaseButton
			{...props}
			ref={ref}
			disabled
			className={clsx(className,
				'flex items-center text-stone-300  w-fit rounded ',
				variant === 'primary' && !disabled && 'bg-wRed-600 hover:bg-wRed-500',
				variant === 'secondary' && !disabled && 'bg-wBlue-700 hover:bg-wBlue-600',
				variant === 'tertiary' && !disabled && 'hover:bg-stone-700',
				variant === 'destructive' && !disabled && 'bg-red-600 hover:bg-red-500',
				disabled && 'bg-stone-600 text-stone-500',
				size === 'xs' && 'text-xs p-1',
				size === 'sm' && 'text-md p-1',
				size === 'md' && 'text-md p-2',
				size === 'lg' && 'text-md p-3',
				size === 'xl' && 'text-md p-4',
			)}
		>
			{children}
		</BaseButton>
	),
);

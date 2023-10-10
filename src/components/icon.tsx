import React from 'react';
import clsx from 'clsx';

export default function Icon({
	name,
	className,
	size = 'md',
	...props
}: {
	readonly className?: string;
	readonly name: string;
	readonly size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl' | '7xl' | '8xl' | '9xl';
} & React.ComponentProps<'span'>) {
	return (
		<span
			{...props} className={clsx(
				'material-symbols-rounded select-none',
				size === 'xs' && 'material-symbols-xs text-xs',
				size === 'sm' && 'material-symbols-sm text-sm',
				size === 'md' && 'material-symbols-md text-md',
				size === 'lg' && 'material-symbols-lg text-lg',
				size === 'xl' && 'material-symbols-xl text-xl',
				size === '2xl' && 'material-symbols-2xl text-2xl',
				size === '3xl' && 'material-symbols-3xl text-3xl',
				size === '4xl' && 'material-symbols-4xl text-4xl',
				size === '5xl' && 'material-symbols-5xl text-5xl',
				size === '6xl' && 'material-symbols-6xl text-6xl',
				size === '7xl' && 'material-symbols-7xl text-7xl',
				size === '8xl' && 'material-symbols-8xl text-8xl',
				size === '9xl' && 'material-symbols-9xl text-9xl',
				className)}
		>
			{name}
		</span>
	);
}

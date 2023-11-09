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
				'material-symbols-rounded select-none leading-none',
				size === 'xs' && 'material-symbols-xs text-lg',
				size === 'sm' && 'material-symbols-sm text-xl',
				size === 'md' && 'material-symbols-md text-2xl w-6 h-6',
				size === 'lg' && 'material-symbols-lg text-3xl',
				size === 'xl' && 'material-symbols-xl text-4xl',
				size === '2xl' && 'material-symbols-2xl text-5xl',
				size === '3xl' && 'material-symbols-3xl text-6xl',
				size === '4xl' && 'material-symbols-4xl text-7xl',
				size === '5xl' && 'material-symbols-5xl text-8xl',
				size === '6xl' && 'material-symbols-6xl text-9xl',
				className)}
		>
			{name}
		</span>
	);
}

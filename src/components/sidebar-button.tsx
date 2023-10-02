'use client';
import React from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import {useSelectedLayoutSegment} from 'next/navigation';
import {Button} from '@/components/button.tsx';

export const SidebarButton = React.forwardRef(
	({
		className,
		href,
		...props
	}: {
		readonly className: string;
		readonly href: string;
	} & React.ComponentProps<typeof Button>, ref: React.ForwardedRef<HTMLButtonElement>) => {
		const layoutSegment = useSelectedLayoutSegment();
		const selected = (layoutSegment === null && href === '/') || href === `/${layoutSegment}`;
		return (
			<Link href={href}>
				<Button
					{...props}
					ref={ref}
					variant='tertiary'
					className={clsx(selected && 'bg-wRed-600 hover:bg-wRed-600', className)}/>
			</Link>
		);
	},
);

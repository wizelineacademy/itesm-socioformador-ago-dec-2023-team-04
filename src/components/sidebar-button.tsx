import React from 'react';
import Link from 'next/link';
import {useSelectedLayoutSegment} from 'next/navigation';
import {Button} from '@/components/button.tsx';

export const SidebarButton = React.forwardRef(
	({
		href,
		...props
	}: {
		readonly href: string;
	} & React.ComponentProps<typeof Button>, ref: React.ForwardedRef<HTMLButtonElement>) => {
		const {children} = props;
		const layoutSegment = useSelectedLayoutSegment();
		const selected = (layoutSegment === null && href === '/') || href === `/${layoutSegment}`;
		return (
			<Link href={href}>
				<Button
					{...props}
					ref={ref}
					data-selected={selected}
					color='tertiary'
					variant='text'
					className='data-[selected=true]:bg-wRed-600 data-[selected=true]:hover:bg-wRed-600 w-full'
				>
					{children}
				</Button>
			</Link>
		);
	},
);

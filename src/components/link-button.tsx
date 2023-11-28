'use client';

import React, {type ReactNode} from 'react';
import Link from 'next/link';
import {Button, type ButtonProps} from '@/components/button.tsx';

export type LinkButtonProps = {
	readonly href: string;
	readonly children: ReactNode;
	readonly className?: string;
} & Pick<ButtonProps, 'color' | 'variant' | 'size' | 'isDisabled'>;

export default function LinkButton(props: LinkButtonProps) {
	const {
		href,
		children,
		className,
	} = props;

	return (
		<Link href={href} className={className}>
			<Button {...props}>
				{children}
			</Button>
		</Link>
	);
}

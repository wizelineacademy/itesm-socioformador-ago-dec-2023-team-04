'use client';
import React from 'react';
import Link from 'next/link';
import {useSelectedLayoutSegment} from 'next/navigation';
import clsx from 'clsx';

export default function AdminNavigationLink({
	slug,
	className,
	...props
}: {
	readonly slug?: string;
} & Omit<React.ComponentProps<typeof Link>, 'href'>) {
	const layoutSegment = useSelectedLayoutSegment();
	const selected = layoutSegment === slug;

	return <Link {...props} href={`/admin/${slug ?? ''}`} className={clsx(!selected && 'text-stone-400 hover:text-stone-300', selected && 'text-stone-200')}/>;
}

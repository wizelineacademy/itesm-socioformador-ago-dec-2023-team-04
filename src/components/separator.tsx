'use client';
import React from 'react';
import {useSeparator, type SeparatorProps as AriaSeparatorProps} from 'react-aria';
import {cx} from '@/lib/cva.ts';

export type SeparatorProps = {
	readonly className?: string;
} & AriaSeparatorProps;

export default function Separator(props: SeparatorProps) {
	const {className, orientation = 'horizontal'} = props;
	const {separatorProps} = useSeparator(props);

	return (
		<div
			{...separatorProps} className={cx(
				'bg-stone-800',
				orientation === 'horizontal' && 'h-[1px] w-full my-4',
				orientation === 'vertical' && 'w-[1px] h-full mx-4',
			)}/>
	);
}

'use client';
import React, {type ReactNode, useState} from 'react';
import {useScrollPosition} from '@n8tb1t/use-scroll-position';
import {cx} from '@/lib/cva.ts';

export type TopBarProps = {
	readonly className?: string;
	readonly children: ReactNode;
	readonly title: ReactNode;
	readonly subtitle?: ReactNode;
};

export default function TopBar(props: TopBarProps) {
	const {className, children, title, subtitle} = props;
	const [floatBar, setFloatBar] = useState(false);

	useScrollPosition(({prevPos, currPos}) => {
		if (currPos.y === 0 && floatBar) {
			setFloatBar(false);
		} else if (!floatBar) {
			setFloatBar(true);
		}
	}, [floatBar]);

	return (
		<div className={cx(
			'bg-stone-900 z-10 sticky w-full top-0 py-4 border-b border-stone-800 transition-all',
			!floatBar && 'pt-10',
			floatBar && '',
			className,
		)}
		>
			<div className='flex items-baseline gap-4 max-w-6xl mx-auto px-4'>
				<h1 className={cx(
					'text-stone-200 transition-all',
					!floatBar && 'text-5xl',
					floatBar && 'text-3xl',
				)}
				>
					{title}
				</h1>
				{
					subtitle && (
						<h2 className={cx(
							'text-stone-400 transition-all',
							!floatBar && 'text-3xl',
							floatBar && 'text-2xl',
						)}
						>
							{subtitle}
						</h2>
					)
				}
				<span className='grow'/>
				{children}
			</div>
		</div>
	);
}

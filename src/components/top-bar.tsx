import React, {ElementRef, type MutableRefObject, type ReactNode, type RefObject, useState} from 'react';
import {useScrollPosition} from '@n8tb1t/use-scroll-position';
import {cx} from '@/lib/cva.ts';

export type TopBarProps = {
	readonly className?: string;
	readonly children: ReactNode;
	readonly scrollRef?: RefObject<HTMLElement>;
	readonly boundingRef?: RefObject<HTMLElement>;
	readonly title: string;
};

export default function TopBar(props: TopBarProps) {
	const {className, children, boundingRef, scrollRef, title} = props;
	const [floatBar, setFloatBar] = useState(false);

	useScrollPosition(({prevPos, currPos}) => {
		if (currPos.y === 0 && floatBar) {
			setFloatBar(false);
		} else if (!floatBar) {
			setFloatBar(true);
		}
		// @ts-expect-error refs are wrongly typed
	}, [floatBar], scrollRef, false, undefined, boundingRef);

	return (
		<div className={cx(
			'bg-stone-900 z-10 sticky top-0 py-4 border-b border-stone-800 transition-all',
			!floatBar && 'pt-10',
			floatBar && '',
			className,
		)}
		>
			<div className='flex items-baseline gap-4 max-w-6xl mx-auto px-4'>
				<h1 className={cx(
					'text-stone-200 text-4xl transition-all',
					!floatBar && 'text-5xl',
					floatBar && 'text-3xl',
				)}
				>
					{title}
				</h1>
				{children}
			</div>
		</div>
	);
}

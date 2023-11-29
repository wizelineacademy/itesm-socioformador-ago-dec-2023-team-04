'use client';
import React, {type ComponentProps, createElement, memo, Suspense, use} from 'react';
import {cx} from '@/lib/cva.ts';
import getIcon from '@/lib/get-icon.ts';
import useStaticContent from '@/lib/hooks/use-static-content.ts';

type IconProps = {
	readonly name: string;
	readonly weight?: 100 | 200 | 300 | 400 | 500 | 600 | 700;
	readonly isFilled?: boolean;
	readonly grade?: -25 | 0 | 200;
	readonly size?: 'sm' | 'md' | 'lg' | 'xl';
	readonly className?: string;
} & ComponentProps<'div'>;

function IconLoader(props: IconProps) {
	const [isHydrating, ref] = useStaticContent();

	// Only render on the server. The client ignores the JS payload and just accepts whatever the server provides.
	if (!isHydrating) {
		return createElement('div', {
			ref,
			suppressHydrationWarning: true,
			// eslint-disable-next-line @typescript-eslint/naming-convention
			dangerouslySetInnerHTML: {
				__html: '',
			},
		});
	}

	const {name, className, weight = 400, grade = 0, isFilled = true, size = 'md'} = props;

	const icon = use(getIcon(name, {
		weight,
		grade,
		isFilled,
		size,
	}));

	if (icon === null) {
		throw new Error('unknown icon');
	}

	return (
		<div
			// eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={{
				__html: icon,
			}}
			suppressHydrationWarning
			className={cx('fill-current', className)}
		/>
	);
}

const Icon = memo((props: IconProps) => {
	const {size = 'md', className} = props;
	return (
		<Suspense fallback={<div className={cx(
			'animate-pulse flex items-center justify-center',
			size === 'sm' && 'w-5 h-5',
			size === 'md' && 'w-6 h-6',
			size === 'lg' && 'w-10 h-10',
			size === 'xl' && 'w-12 h-12',
			className,
		)}/>}
		>
			<IconLoader {...props}/>
		</Suspense>
	);
});

export default Icon;

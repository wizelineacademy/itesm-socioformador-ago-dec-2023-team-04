'use client';

import React from 'react';
import * as BaseSeparator from '@radix-ui/react-separator';
import {cx} from '@/lib/cva.ts';

export default function Separator({
	orientation,
	className,
	...props
}: BaseSeparator.SeparatorProps) {
	return <BaseSeparator.Root {...props} orientation={orientation} className={cx(className, orientation === 'horizontal' && 'my-2 w-full', orientation === 'vertical' && 'mx-2 h-full', 'bg-stone-800')}/>;
}

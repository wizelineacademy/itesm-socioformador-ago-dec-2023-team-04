import React, {type ReactNode, useRef} from 'react';
import {type AriaDialogProps, useDialog} from 'react-aria';
import {cx} from '@/lib/cva.ts';

export type DialogProps = {
	readonly title?: ReactNode;
	readonly children: ReactNode;
	readonly className?: ReactNode;
} & AriaDialogProps;

export default function Dialog(props: DialogProps) {
	const {title, children, className} = props;
	const ref = useRef<HTMLDivElement>(null);
	const {dialogProps, titleProps} = useDialog(props, ref);

	return (
		<div {...dialogProps} ref={ref} className={cx('p-8 outline-none', className)}>
			{
				title === undefined
					? null
					: <h3 {...titleProps} className='text-stone-300 text-xl  mb-1'>
						{title}
					</h3>
			}
			{children}
		</div>
	);
}

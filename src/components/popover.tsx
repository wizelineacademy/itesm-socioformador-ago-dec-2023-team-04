import React, {type ReactNode, useRef} from 'react';
import {type AriaPopoverProps, DismissButton, Overlay, usePopover} from 'react-aria';
import {type OverlayTriggerState} from 'react-stately';
import {cx} from '@/lib/cva.ts';

export type PopoverProps = {
	readonly className?: string;
	readonly state: OverlayTriggerState;
	readonly children: ReactNode;
} & Omit<AriaPopoverProps, 'popoverRef'>;

export default function Popover(props: PopoverProps) {
	const {className, state, children, offset = 8} = props;

	const popoverRef = useRef<HTMLDivElement>(null);

	const {popoverProps, underlayProps, arrowProps, placement} = usePopover({
		...props,
		offset, popoverRef,
	}, state);

	return (
		<Overlay>
			<div {...underlayProps} className='fixed inset-0'/>
			<div {...popoverProps} ref={popoverRef} className={cx('bg-stone-800 border border-stone-700 rounded', className)}>
				<svg
					{...arrowProps}
					className={cx(
						'absolute fill-stone-700 stroke-stone-700 stroke-1 w-4 h-4',
						placement === 'top' && 'top-full -translate-x-1/2',
						placement === 'bottom' && 'bottom-full -translate-x-1/2 rotate-180',
						placement === 'left' && 'left-full -translate-y-1/2 -rotate-90',
						placement === 'right' && 'right-full -translate-y-1/2 rotate-90',
					)}
					viewBox='0 0 12 12'
				>
					<path d='M0 0 L6 6 L12 0'/>
				</svg>
				<DismissButton onDismiss={state.close}/>
				{children}
				<DismissButton onDismiss={state.close}/>
			</div>
		</Overlay>
	);
}

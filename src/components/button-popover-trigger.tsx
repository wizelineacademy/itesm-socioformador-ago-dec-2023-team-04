import React, {cloneElement, type ReactElement, type ReactNode, useRef} from 'react';
import {mergeProps, useOverlayTrigger} from 'react-aria';
import {type OverlayTriggerProps as OverlayTriggerStateProps, useOverlayTriggerState} from 'react-stately';
import {Button, type ButtonProps} from '@/components/button.tsx';
import Popover from '@/components/popover.tsx';

export type ButtonPopoverTriggerProps = {
	readonly children: ReactElement;
	readonly className?: string;
	readonly label: ReactNode;
} & OverlayTriggerStateProps & Pick<ButtonProps, 'size' | 'variant' | 'color' | 'isDisabled'>;

export default function ButtonPopoverTrigger(props: ButtonPopoverTriggerProps) {
	const {children, label, className} = props;
	const state = useOverlayTriggerState(props);
	const triggerRef = useRef<HTMLButtonElement>(null);
	const {triggerProps, overlayProps} = useOverlayTrigger({
		type: 'dialog',
	}, state, triggerRef);

	return (
		<>
			<Button {...mergeProps(triggerProps, props)} ref={triggerRef} className={className}>{label}</Button>
			{
				state.isOpen
					? <Popover {...props} triggerRef={triggerRef} state={state}>
						{
							cloneElement(
								children,
								overlayProps,
							)
						}
					</Popover>
					: null
			}
		</>
	);
}

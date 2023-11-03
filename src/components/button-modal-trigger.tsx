import React, {cloneElement, type ReactElement, type ReactNode} from 'react';
import {mergeProps, useOverlayTrigger} from 'react-aria';
import {type OverlayTriggerProps as OverlayTriggerStateProps, useOverlayTriggerState} from 'react-stately';
import Modal from '@/components/modal.tsx';
import {Button, type ButtonProps} from '@/components/button.tsx';

export type ButtonModalTriggerProps = {
	readonly children: (close: () => void) => ReactElement;
	readonly className?: string;
	readonly label: ReactNode;
} & OverlayTriggerStateProps & Pick<ButtonProps, 'size' | 'variant' | 'color'>;

export default function ButtonModalTrigger(props: ButtonModalTriggerProps) {
	const {children, label, className} = props;
	const state = useOverlayTriggerState(props);
	const {triggerProps, overlayProps} = useOverlayTrigger({
		type: 'dialog',
	}, state);

	return (
		<>
			<Button {...mergeProps(triggerProps, props)} className={className}>{label}</Button>
			{
				state.isOpen
					? <Modal {...props} state={state}>
						{
							cloneElement(
								children(state.close),
								overlayProps,
							)
						}
					</Modal>
					: null
			}
		</>
	);
}

import React, {type ReactNode, useRef} from 'react';
import {type OverlayTriggerState} from 'react-stately';
import {type AriaModalOverlayProps, Overlay, useModalOverlay} from 'react-aria';

export type ModalProps = {
	readonly state: OverlayTriggerState;
	readonly children: ReactNode;
} & AriaModalOverlayProps;

export default function Modal(props: ModalProps) {
	const {state, children} = props;
	const ref = useRef<HTMLDivElement>(null);
	const {modalProps, underlayProps} = useModalOverlay(props, state, ref);

	return (
		<Overlay>
			<div {...underlayProps} className='fixed z-50 top-0 left-0 bottom-0 right-0 bg-black/40 flex justify-center items-center'>
				<div {...modalProps} ref={ref} className='bg-stone-900 border border-stone-700 rounded'>
					{children}
				</div>
			</div>
		</Overlay>
	);
}

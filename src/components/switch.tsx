import React from 'react';
import {useToggleState} from 'react-stately';
import {type AriaSwitchProps, useFocusRing, useSwitch, VisuallyHidden} from 'react-aria';
import {type ToggleStateOptions} from '@react-stately/toggle';
import {cx} from '@/lib/cva.ts';

export type SwitchProps = {
	readonly className?: string;
} & ToggleStateOptions & AriaSwitchProps;

export default function Switch(props: SwitchProps) {
	const {className} = props;
	const state = useToggleState(props);
	const ref = React.useRef(null);
	const {inputProps} = useSwitch(props, state, ref);
	const {isFocusVisible, focusProps} = useFocusRing();

	return (
		<label
			className={cx('flex items-center text-stone-400 focus-within:text-stone-50 text-xs', className)}
		>
			<VisuallyHidden>
				<input {...inputProps} {...focusProps} ref={ref}/>
			</VisuallyHidden>
			<svg
				width={40}
				height={24}
				aria-hidden='true'
				className='me-1'
			>
				<rect
					x={4}
					y={4}
					width={32}
					height={16}
					rx={8}
					className={cx(
						state.isSelected && 'fill-wRed-600',
						!state.isSelected && 'fill-stone-600',
						isFocusVisible && 'stroke-1 stroke-stone-50',
					)}
				/>
				<circle
					className='transition-all fill-stone-50'
					cx={state.isSelected ? 28 : 12}
					cy={12}
					r={5}
				/>
			</svg>
			{props.children}
		</label>
	);
}

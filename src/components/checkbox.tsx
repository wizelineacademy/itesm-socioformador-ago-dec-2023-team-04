import {type ToggleProps, useToggleState} from 'react-stately';
import {type AriaCheckboxProps, mergeProps, useCheckbox, useFocusRing, usePress, VisuallyHidden} from 'react-aria';
import React, {useRef} from 'react';
import {cx} from '@/lib/cva.ts';

export type CheckboxProps = {
	readonly className?: string;
} & AriaCheckboxProps & ToggleProps;

export default function Checkbox(props: CheckboxProps) {
	const {children, className} = props;
	const ref = useRef<HTMLInputElement>(null);
	const state = useToggleState(props);
	const {inputProps} = useCheckbox(props, state, ref);
	const {focusProps} = useFocusRing();
	const {pressProps} = usePress({isDisabled: props.isDisabled});

	const {isSelected} = state;

	return (
		<label className={cx('flex gap-2 text-stone-300 rounded', className)}>
			<VisuallyHidden>
				<input {...mergeProps(inputProps, focusProps)} ref={ref}/>
			</VisuallyHidden>
			<div className='w-6 h-6 border border-stone-600 rounded p-1 cursor-pointer' aria-hidden='true'>
				<svg {...pressProps} className='fill-none stroke-wRed-400 stroke-2' viewBox='0 0 18 18'>
					<polyline
						className='transition-all duration-200'
						points='1 9 7 14 15 4'
						strokeDasharray={24}
						strokeDashoffset={isSelected ? 48 : 72}
					/>
				</svg>
			</div>
			{children}
		</label>
	);
}

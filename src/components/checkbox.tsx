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
		<label className={cx('flex gap-2 text-stone-300', className)}>
			<VisuallyHidden>
				<input {...mergeProps(inputProps, focusProps)} ref={ref}/>
			</VisuallyHidden>
			<div className='w-6 h-6 border border-stone-700 rounded p-1 cursor-pointer' aria-hidden='true'>
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

export type CheckBoxProps = {
	readonly className?: string;
	readonly checked: string | boolean;
	readonly onCheckedChange: () => void;
} & AriaCheckboxProps;

export function Checkbox2(props: CheckBoxProps) {
	const {children, className, checked, onCheckedChange} = props;
	const state = useToggleState(props);
	const ref = React.useRef(null);
	const {inputProps} = useCheckbox(props, state, ref);
	const {isFocusVisible, focusProps} = useFocusRing();
	const isSelected = state.isSelected && !props.isIndeterminate;

	return (
		<label className={cx('w-6 h-6 rounded border-stone-700 border relative hover:bg-stone-700', className)}>
			<VisuallyHidden>
				<input {...mergeProps(inputProps, focusProps)} ref={ref}/>
			</VisuallyHidden>
			<svg className='h-6 w-6git'>
				<rect
					className={cx(isSelected, 'w-6 h-6 rounded border-stone-700 border relative fill-wRed-400',
						!isSelected, 'w-6 h-6 rounded border-stone-700 border relative fill-none', className)}/>
				{isSelected && (
					<path
						transform='translate(7 7)'
						d={`M3.788 9A.999.999 0 0 1 3 8.615l-2.288-3a1 1 0 1 1
            1.576-1.23l1.5 1.991 3.924-4.991a1 1 0 1 1 1.576 1.23l-4.712
            6A.999.999 0 0 1 3.788 9z`}
					/>
				)}
				{props.isIndeterminate
									&& <rect className='w-6 h-6 fill-stone-700 rounded border-stone-700 border relative'/>}
				{isFocusVisible && (
					<rect
						className='w-6 h-6 fill-none stroke-2 stroke-wRed-600 rounded relative'
					/>
				)}
			</svg>
			{props.children}
		</label>
	);
}

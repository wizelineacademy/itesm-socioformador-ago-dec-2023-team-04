'use client';
import React from 'react';
import * as BaseCheckbox from '@radix-ui/react-checkbox';
import {useToggleState} from 'react-stately';
import {type AriaCheckboxProps, useCheckbox, mergeProps, useFocusRing, VisuallyHidden} from 'react-aria';
import Icon from '@/components/icon.tsx';
import {cx} from '@/lib/cva.ts';

export default function Checkbox({className, ...props}: {readonly className?: string} & BaseCheckbox.CheckboxProps) {
	return (
		<BaseCheckbox.Root
			{...props}
			className={cx('w-6 h-6 rounded border-stone-700 border relative hover:bg-stone-700', className)}
		>
			<BaseCheckbox.Indicator className='group'>
				<Icon name='check' className='leading-none group-data-[state=indeterminate]:hidden text-wRed-400'/>
				<Icon
					name='check_indeterminate_small'
					className='text-md group-data-[state=checked]:hidden text-wRed-400'/>
			</BaseCheckbox.Indicator>
		</BaseCheckbox.Root>
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
				{props.isIndeterminate && <rect className='w-6 h-6 fill-stone-700 rounded border-stone-700 border relative'/>}
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

import React, {type Key, useRef} from 'react';
import {type RadioGroupState, useOverlayTriggerState, useRadioGroupState} from 'react-stately';
import {mergeProps, useButton, useId, useOverlayTrigger, useRadio, useRadioGroup, VisuallyHidden} from 'react-aria';
import {type Color} from '@prisma/client';
import {useObjectRef} from '@react-aria/utils';
import {cx} from '@/lib/cva.ts';
import {type ButtonProps} from '@/components/button.tsx';
import Popover from '@/components/popover.tsx';

const RadioContext = React.createContext(null);

export type ColorSelectorProps = {
	readonly colors: Color[];
	readonly label?: string;
	readonly className?: string;
	readonly selectedColor: Key;
	readonly onSelectedColorChange: (selectedColor: Key) => void;
};

export default function ColorSelector(props: ColorSelectorProps) {
	const {colors, className, selectedColor, onSelectedColorChange, label} = props;

	const state = useOverlayTriggerState({});
	const triggerRef = useRef<HTMLButtonElement>(null);
	const {triggerProps, overlayProps} = useOverlayTrigger({
		type: 'dialog',
	}, state, triggerRef);

	const color = colors.find(color => color.id.toString() === selectedColor);

	const labelId = useId();

	return (
		<div className={className}>
			{
				label && <label id={labelId} className={cx('block text-stone-400 text-xs mb-1', state.isOpen && 'text-stone-50')}>
					{label}
				</label>
			}

			<ColorButton {...mergeProps(triggerProps, props)} ref={triggerRef} color={color?.code} aria-labelledby={labelId}/>
			{
				state.isOpen
					? <Popover {...props} triggerRef={triggerRef} state={state} className='p-1' placement='bottom start'>
						<ColorRadioGroup {...overlayProps} colors={colors} value={selectedColor.toString()} onValueChange={onSelectedColorChange}/>
					</Popover>
					: null
			}
		</div>
	);
}

type ColorButtonProps = {
	readonly color?: string;
} & Omit<ButtonProps, 'children' | 'color'>;

const ColorButton = React.forwardRef(
	(props: ColorButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
		const {className, color} = props;
		const buttonRef = useObjectRef(ref);
		const {buttonProps} = useButton(props, buttonRef);
		return (
			// eslint-disable-next-line react/button-has-type
			<button
				{...buttonProps} ref={buttonRef} className={cx('block outline-none border focus:border-stone-50 rounded h-10 w-full border-stone-600', !color && 'bg-stone-700', className)}
				style={{
					backgroundColor: color === undefined ? undefined : `#${color}`,
				}}
			/>
		);
	},
);

type ColorRadioGroupProps = {
	readonly colors: Color[];
	readonly className?: string;
	readonly value: string;
	readonly onValueChange: (value: string) => void;
};

function ColorRadioGroup(props: ColorRadioGroupProps) {
	const {colors, value, onValueChange, className} = props;
	const state = useRadioGroupState({
		value,
		onChange: onValueChange,
	});
	const {
		radioGroupProps,
	} = useRadioGroup({
		'aria-label': 'Selecciona un color',
	}, state);

	return (
		<div {...radioGroupProps} className={cx('grid gap-1 grid-cols-5', className)}>
			{colors.map(color => (
				<ColorRadio key={color.id} state={state} color={color}/>
			))}
		</div>
	);
}

type ColorRadioProps = {
	readonly state: RadioGroupState;
	readonly color: Color;
};

function ColorRadio(props: ColorRadioProps) {
	const {state, color} = props;
	const ref = React.useRef(null);
	const {inputProps, isSelected} = useRadio({
		value: color.id.toString(),
	}, state, ref);

	return (
		<label
			className={cx(
				'w-8 h-8 rounded',
				isSelected && 'border border-stone-50',
			)} style={{
				backgroundColor: `#${color.code}`,
			}}
		>
			<VisuallyHidden>
				<input {...inputProps} ref={ref}/>
			</VisuallyHidden>
		</label>
	);
}

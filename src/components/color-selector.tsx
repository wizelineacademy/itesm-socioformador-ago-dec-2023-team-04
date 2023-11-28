import React from 'react';
import {type RadioGroupProps, type RadioGroupState, useRadioGroupState} from 'react-stately';
import {
	type AriaRadioGroupProps,
	type AriaRadioProps,
	useRadio,
	useRadioGroup,
	VisuallyHidden,
} from 'react-aria';
import {type Color} from '@prisma/client';
import {cx} from '@/lib/cva.ts';

const RadioContext = React.createContext(null);

type ColorRadioGroupProps = {
	readonly colors: Color[];
	readonly className?: string;
} & RadioGroupProps & AriaRadioGroupProps;

export default function ColorRadioGroup(props: ColorRadioGroupProps) {
	const {colors, className, label, isRequired, isDisabled} = props;
	const state = useRadioGroupState({
		validationBehavior: 'native',
		...props,
	});
	const {
		radioGroupProps,
		isInvalid,
		validationErrors,
		labelProps,
	} = useRadioGroup({
		validationBehavior: 'native',
		...props,
	}, state);

	return (
		<div {...radioGroupProps} className={cx('flex gap-1 flex-wrap', className)}>
			{
				label && (
					<label
						{...labelProps} className={cx(
							'group-focus-within:text-stone-50 text-stone-400 text-xs block mb-1',
							isRequired && 'after:content-["_*"]',
							isDisabled && 'text-stone-500',
						)}
					>
						{label}
					</label>
				)
			}
			<div className='flex gap-1 flex-wrap'>
				{colors.map(color => (
					<ColorRadio key={color.id} aria-label={`#${color.code}`} state={state} color={color}/>
				))}
			</div>

			{
				isInvalid && <div className='mt-1 text-red-400 text-xs'>
					{validationErrors.join(' ')}
				</div>
			}
		</div>

	);
}

type ColorRadioProps = {
	readonly state: RadioGroupState;
	readonly color: Color;
} & Omit<AriaRadioProps, 'value'>;

function ColorRadio(props: ColorRadioProps) {
	const {state, color} = props;
	const ref = React.useRef(null);
	const {inputProps, isSelected} = useRadio({
		...props,
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

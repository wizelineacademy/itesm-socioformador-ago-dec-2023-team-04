import React, {type ReactNode} from 'react';
import {type RadioGroupState, useRadioGroupState, type RadioGroupProps as RadioGroupStateProps} from 'react-stately';
import {
	type AriaRadioProps,
	useRadio,
	useRadioGroup,
	useFocusRing,
	VisuallyHidden,
	mergeProps,
	type AriaRadioGroupProps,
} from 'react-aria';
import {cx} from '@/lib/cva.ts';

const RadioContext = React.createContext<RadioGroupState | null>(null);

export type RadioGroupProps = {
	readonly label?: ReactNode;
	readonly children: ReactNode;
	readonly description?: ReactNode;
	readonly errorMessage?: ReactNode;
	readonly className?: ReactNode;
} & AriaRadioGroupProps & RadioGroupStateProps;

export function RadioGroup(props: RadioGroupProps) {
	const {children, label, description, errorMessage} = props;
	const state = useRadioGroupState(props);
	const {radioGroupProps, labelProps, descriptionProps, errorMessageProps}
        = useRadioGroup(props, state);

	return (
		<div {...radioGroupProps}>
			<span {...labelProps}>{label}</span>
			<RadioContext.Provider value={state}>
				{children}
			</RadioContext.Provider>
			{description && (
				<div {...descriptionProps} style={{fontSize: 12}}>{description}</div>
			)}
			{errorMessage && state.isInvalid && (
				<div {...errorMessageProps} style={{color: 'red', fontSize: 12}}>
					{errorMessage}
				</div>
			)}
		</div>
	);
}

export type RadioProps = AriaRadioProps;
export function Radio(props: RadioProps) {
	const {children} = props;
	const state = React.useContext(RadioContext);
	const ref = React.useRef(null);
	if (state === null) {
		throw new Error('must be in a RadioGroup');
	}

	const {inputProps, isSelected, isDisabled} = useRadio(props, state, ref);
	const {isFocusVisible, focusProps} = useFocusRing();

	return (
		<label style={{
			display: 'flex',
			alignItems: 'center',
			opacity: isDisabled ? 0.4 : 1,
		}}
		>
			<VisuallyHidden>
				<input {...mergeProps(inputProps, focusProps)} ref={ref}/>
			</VisuallyHidden>
			<svg
				width={28}
				height={28}
				aria-hidden='true'
				style={{margin: 4}}
			>
				<circle
					cx={14}
					cy={14}
					r={8}
					className={cx('stroke-2 stroke-stone-600 fill-none',
						isSelected && 'fill-wRed-600')}
				/>
				{isFocusVisible && (
					<circle
						cx={14}
						cy={14}
						r={12}
						className='stroke-2 stroke-wRed-600 fill-none h-3/4 w-3/4'
					/>
				)}
			</svg>
			{children}
		</label>
	);
}

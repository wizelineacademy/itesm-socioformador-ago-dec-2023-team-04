import React, {type ReactNode} from 'react';
import {type CheckboxGroupProps, type CheckboxGroupState, useCheckboxGroupState} from 'react-stately';
import {
	type AriaCheckboxGroupItemProps,
	type AriaCheckboxGroupProps, mergeProps,
	useCheckboxGroup,
	useCheckboxGroupItem, useFocusRing, VisuallyHidden,
} from 'react-aria';
import {cx} from '@/lib/cva.ts';

export type ButtonGroupProps = {
	readonly className?: string;
	readonly children: ReactNode;
} & CheckboxGroupProps & AriaCheckboxGroupProps;

const ButtonContext = React.createContext<CheckboxGroupState | null>(null);

export default function ButtonGroup(props: ButtonGroupProps) {
	const {children, className, label, isRequired, isDisabled} = props;

	const state = useCheckboxGroupState(props);

	const {groupProps, labelProps} = useCheckboxGroup(props, state);

	return (
		<div className={className}>
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
			<div {...groupProps} className='flex flex-wrap rounded overflow-hidden text-stone-300 border border-stone-600'>
				<ButtonContext.Provider value={state}>
					{children}
				</ButtonContext.Provider>
			</div>
		</div>

	);
}

type GroupedButtonProps = AriaCheckboxGroupItemProps;

export function GroupedButton(props: GroupedButtonProps) {
	const state = React.useContext(ButtonContext);
	if (state === null) {
		throw new Error('Grouped button not used within group.');
	}

	const ref = React.useRef(null);
	const {inputProps} = useCheckboxGroupItem(props, state, ref);
	const {focusProps, isFocusVisible} = useFocusRing();
	const isSelected = state.isSelected(props.value);

	return (
		<label className={cx(
			'p-1 cursor-pointer grow text-center ',
			isSelected && 'bg-wRed-400 text-stone-800 hover:bg-wRed-300',
			!isSelected && 'hover:bg-stone-700',
		)}
		>
			<VisuallyHidden>
				<input {...mergeProps(inputProps, focusProps)} ref={ref}/>
			</VisuallyHidden>
			{props.children}
		</label>
	);
}

import React, {useRef} from 'react';
import {type AriaSelectProps, HiddenSelect, useSelect} from 'react-aria';
import {type SelectStateOptions, useSelectState} from 'react-stately';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import Popover from '@/components/popover.tsx';
import ListBox from '@/components/list-box.tsx';

export type SelectProps<T> = {
	readonly className?: string;
} & AriaSelectProps<T> & SelectStateOptions<T>;

export default function Select<T extends object>(props: SelectProps<T>) {
	const {className, isDisabled, label, name} = props;

	const state = useSelectState<T>(props);

	const buttonRef = useRef<HTMLButtonElement>(null);

	const {
		labelProps,
		triggerProps,
		valueProps,
		menuProps,
	} = useSelect(props, state, buttonRef);

	return (
		<div className={className}>
			<div {...labelProps} className='text-stone-300 text-sm mb-1'> {label} </div>
			<HiddenSelect
				state={state} triggerRef={buttonRef} isDisabled={isDisabled}
				label={label} name={name}/>
			<Button
				{...triggerProps}
				ref={buttonRef}
				color='tertiary'
				variant='outlined'
			>
				<span {...valueProps}>
					{
						state.selectedItem
							? state.selectedItem.rendered
							: 'Selecciona una opción'
					}
				</span>
				<Icon name='arrow_drop_down'/>
			</Button>
			{
				state.isOpen
					? <Popover state={state} triggerRef={buttonRef} placement='bottom start'>
						<ListBox {...menuProps} state={state}/>
					</Popover>
					: null
			}
		</div>
	);
}

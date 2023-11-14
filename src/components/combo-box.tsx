import React from 'react';
import {type ComboBoxStateOptions, useComboBoxState} from 'react-stately';
import {type AriaComboBoxOptions, useComboBox, useFilter} from 'react-aria';
import {Button} from '@/components/button.tsx';
import Popover from '@/components/popover.tsx';
import ListBox from '@/components/list-box.tsx';
import Icon from '@/components/icon.tsx';
import {cx} from '@/lib/cva.ts';

export type ComboBoxProps<T> = {
	readonly className?: string;
	readonly iconName?: string;
} & ComboBoxStateOptions<T> & Omit<AriaComboBoxOptions<T>, 'buttonRef' | 'inputRef' | 'listBoxRef' | 'popoverRef'>;

export default function ComboBox<T extends object>(props: ComboBoxProps<T>) {
	const {
		label,
		iconName,
		isRequired,
		isDisabled,
		className,
	} = props;

	const {contains} = useFilter({sensitivity: 'base'});
	const state = useComboBoxState({
		...props,
		defaultFilter: contains,
	});

	// Setup refs and get props for child elements.
	const buttonRef = React.useRef(null);
	const inputRef = React.useRef(null);
	const listBoxRef = React.useRef(null);
	const popoverRef = React.useRef(null);

	const {
		buttonProps,
		inputProps,
		listBoxProps,
		labelProps,
	} = useComboBox(
		{
			...props,
			inputRef,
			buttonRef,
			listBoxRef,
			popoverRef,
		},
		state,
	);

	return (
		<div className={cx('w-72', className)}>
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
			<div className={cx(
				'flex items-center bg-stone-700 text-stone-500 rounded border border-stone-600 p-1 h-10 w-full focus-within:border-stone-50 focus-within:text-stone-50',
				isDisabled && 'hover:cursor-not-allowed bg-stone-700 border-stone-700',
			)}
			>
				{iconName && <Icon name={iconName} className='me-1'/>}
				<input
					{...inputProps}
					ref={inputRef}
					className='bg-transparent outline-none py-1 grow'
				/>
				<Button
					variant='text'
					color='tertiary'
					className='text-inherit'
					{...buttonProps}
					ref={buttonRef}
					size='sm'
				>
					<Icon name='arrow_drop_down'/>
				</Button>
				{
					state.isOpen && (
						<Popover
							ref={popoverRef}
							isNonModal
							className='w-72'
							state={state}
							crossOffset={-32}
							offset={14}
							triggerRef={inputRef}
							placement='bottom start'
						>
							<ListBox
								{...listBoxProps}
								ref={listBoxRef}
								state={state}
							/>
						</Popover>
					)
				}
			</div>
		</div>
	);
}

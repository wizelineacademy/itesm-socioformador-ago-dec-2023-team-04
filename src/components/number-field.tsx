import React from 'react';
import {type AriaNumberFieldProps, useLocale, useNumberField} from 'react-aria';
import {type NumberFieldStateOptions, useNumberFieldState} from 'react-stately';
import {useObjectRef} from '@react-aria/utils';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import {cx} from '@/lib/cva.ts';

export type NumberFieldProps = {
	readonly className?: string;
	readonly name?: string;
	readonly icon?: string;
} & AriaNumberFieldProps & Omit<NumberFieldStateOptions, 'locale'>;

export const NumberField = React.forwardRef((
	props: NumberFieldProps,
	ref: React.ForwardedRef<HTMLInputElement>,
) => {
	const {locale} = useLocale();
	const {label, className, icon, isDisabled, name, isRequired} = props;
	const state = useNumberFieldState({
		validationBehavior: 'native',
		...props,
		locale,
	});
	const inputRef = useObjectRef(ref);
	const {
		labelProps,
		groupProps,
		inputProps,
		incrementButtonProps,
		decrementButtonProps,
		errorMessageProps,
		isInvalid,
		validationErrors,
	} = useNumberField({
		validationBehavior: 'native',
		...props,
	}, state, inputRef);
	return (
		<div data-disabled={isDisabled} className={cx('group h-fit', className)}>
			<label
				{...labelProps} className={cx(
					'group-focus-within:text-stone-50 text-stone-400 text-xs block mb-1',
					isRequired && 'after:content-["_*"]',
					isDisabled && 'text-stone-500',
				)}
			>
				{label}
			</label>

			<div className={cx(
				'flex items-center bg-stone-700 text-stone-500 rounded border border-stone-600 w-full focus-within:border-stone-50 focus-within:text-stone-50',
				isDisabled && 'hover:cursor-not-allowed bg-stone-700 border-stone-700',
			)}
			>
				{icon && <Icon name={icon} className='text-stone-500 group-focus-within:text-stone-50 me-1 flex-none basis-4'/>}
				<input {...inputProps} ref={inputRef} name={name} className='p-1 bg-transparent min-w-0 w-full text-stone-200 outline-none disabled:text-stone-600 disabled:cursor-not-allowed'/>
				<div className='flex-none basis-4'>
					<Button {...incrementButtonProps} variant='text' size='xs' color='tertiary'>
						<Icon name='arrow_drop_up' size='sm' className='h-4 w-4'/>
					</Button>
					<Button {...decrementButtonProps} variant='text' size='xs' color='tertiary' className='h-4 w-4'>
						<Icon name='arrow_drop_down' size='sm'/>
					</Button>
				</div>
			</div>
			{
				isInvalid && <div {...errorMessageProps} className='text-red-400 mt-1 text-xs'>
					{validationErrors.join(' ')}
				</div>
			}
		</div>
	);
});

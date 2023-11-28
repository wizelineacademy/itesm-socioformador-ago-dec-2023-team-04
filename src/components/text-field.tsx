import React, {useRef} from 'react';
import {type AriaTextFieldProps, useTextField} from 'react-aria';
import {cx} from '@/lib/cva.ts';
import Icon from '@/components/icon.tsx';

export type TextFieldProps = {
	readonly className?: string;
	readonly iconName?: string;
} & AriaTextFieldProps;

export default function TextField(props: TextFieldProps) {
	const {
		label,
		className,
		description,
		isDisabled,
		isRequired,
		iconName,
	} = props;
	const inputRef = useRef<HTMLInputElement>(null);

	const {
		labelProps,
		inputProps,
		descriptionProps,
		errorMessageProps,
		validationErrors,
		isInvalid,
	} = useTextField({
		validationBehavior: 'native',
		...props,
	}, inputRef);

	return (
		<div className={cx('group h-fit', className)}>
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
				{iconName && <Icon className='me-1' name={iconName}/>}
				<input
					{...inputProps} ref={inputRef} className='bg-transparent outline-none text-stone-300'/>
			</div>

			{
				description && (
					<div {...descriptionProps}>
						{description}
					</div>
				)
			}
			{
				isInvalid && (
					<div {...errorMessageProps} className='mt-1 text-red-400 text-xs'>
						{validationErrors.join(' ')}
					</div>
				)
			}
		</div>
	);
}

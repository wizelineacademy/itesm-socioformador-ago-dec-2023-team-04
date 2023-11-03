import React, {useRef} from 'react';
import {type AriaTextFieldProps, useTextField} from 'react-aria';
import {cx} from '@/lib/cva.ts';

export type TextFieldProps = {
	readonly className?: string;
} & AriaTextFieldProps;

export default function TextField(props: TextFieldProps) {
	const {
		label,
		className,
		description,
		errorMessage,
		isDisabled,
		isRequired,
	} = props;
	const inputRef = useRef<HTMLInputElement>(null);

	const {
		labelProps,
		inputProps,
		descriptionProps,
		errorMessageProps,
	} = useTextField(props, inputRef);

	return (
		<div className={className}>
			{
				label && (
					<label
						{...labelProps} className={cx(
							'text-stone-400 text-xs block mb-1',
							isRequired && 'after:content-["_*"]',
							isDisabled && 'text-stone-500',
						)}
					>
						{label}
					</label>
				)
			}
			<input
				{...inputProps} ref={inputRef} className={cx(
					'bg-stone-700 text-stone-300 rounded border border-stone-600 p-1 w-full',
					isDisabled && 'hover:cursor-not-allowed bg-stone-700 border-stone-700',
				)}/>
			{
				description && (
					<div {...descriptionProps}>
						{description}
					</div>
				)
			}
			{
				errorMessage && (
					<div {...errorMessageProps} className='mt-1 text-red-400 text-xs'>
						{props.errorMessage}
					</div>
				)
			}
		</div>
	);
}

import React, {useRef} from 'react';
import {type AriaTextFieldProps, useTextField} from 'react-aria';
import {cx} from '@/lib/cva.ts';

export type TextAreaProps = {
	readonly className?: string;
} & AriaTextFieldProps;

export default function TextArea(props: TextAreaProps) {
	const {
		label,
		className,
		description,
		errorMessage,
		isDisabled,
		isRequired,
	} = props;
	const inputRef = useRef<HTMLTextAreaElement>(null);

	const {
		labelProps,
		inputProps,
		descriptionProps,
		errorMessageProps,
	} = useTextField({
		...props,
		inputElementType: 'textarea',
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
			<textarea
				{...inputProps} ref={inputRef} className={cx(
					'bg-stone-700 h-32 min-h-[2.2rem] text-stone-300 outline-none rounded border border-stone-600 p-1 w-full focus-within:border-stone-50 focus-within:text-stone-50',
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

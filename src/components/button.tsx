import React, {type ReactNode} from 'react';
import {type AriaButtonProps, mergeProps, useButton, useFocusRing} from 'react-aria';
import {useObjectRef} from '@react-aria/utils';
import {cva, cx, type VariantProps} from '@/lib/cva.ts';

const buttonVariant = cva({
	base: 'flex items-center text-stone-300 w-fit rounded h-fit outline-none',
	variants: {
		color: {
			primary: '',
			secondary: '',
			tertiary: '',
			destructive: '',
		},
		variant: {
			contained: 'enabled:hover:brightness-90 disabled:bg-stone-700 disabled:text-stone-500 disabled:cursor-not-allowed',
			outlined: 'bg-transparent border',
			text: 'enabled:hover:bg-stone-700',
		},
		size: {
			xs: 'text-xs',
			sm: 'text-sm p-1',
			md: 'text-base p-2',
			lg: 'text-lg p-3',
			xl: 'text-xl p-4',
		},
	},
	compoundVariants: [
		{
			color: 'primary',
			variant: 'contained',
			className: 'bg-wRed-600',
		},
		{
			color: 'secondary',
			variant: 'contained',
			className: 'bg-wBlue-700',
		},
		{
			color: 'tertiary',
			variant: 'contained',
			className: 'bg-stone-600',
		},
		{
			color: 'destructive',
			variant: 'contained',
			className: 'bg-red-600',
		},
		{
			color: 'primary',
			variant: 'outlined',
			className: 'border-wRed-500 enabled:hover:bg-wRed-500',
		},
		{
			color: 'secondary',
			variant: 'outlined',
			className: 'border-wBlue-500 enabled:hover:bg-wBlue-500',
		},
		{
			color: 'tertiary',
			variant: 'outlined',
			className: 'border-stone-600 enabled:hover:bg-stone-600',
		},
		{
			color: 'destructive',
			variant: 'outlined',
			className: 'border-red-500 enabled:hover:bg-red-500',
		},
		{
			color: 'primary',
			variant: 'text',
			className: 'text-wRed-500',
		},
		{
			color: 'secondary',
			variant: 'text',
			className: 'text-wBlue-300',
		},
		{
			color: 'tertiary',
			variant: 'text',
			className: 'text-stone-300',
		},
		{
			color: 'destructive',
			variant: 'text',
			className: 'text-red-500',
		},
	],
	defaultVariants: {
		color: 'primary',
		variant: 'contained',
		size: 'md',
	},
});

export type ButtonProps = {
	readonly className?: string;
	readonly children: ReactNode;
} & VariantProps<typeof buttonVariant> & AriaButtonProps;

export const Button = React.forwardRef(
	(props: ButtonProps, ref: React.ForwardedRef<HTMLButtonElement>) => {
		const {children, className, isDisabled} = props;
		const buttonRef = useObjectRef(ref);
		const {buttonProps} = useButton(props, buttonRef);

		const {isFocusVisible, focusProps} = useFocusRing();

		return (
			// eslint-disable-next-line react/button-has-type
			<button
				{...mergeProps(buttonProps, focusProps)} ref={buttonRef} className={cx(
					buttonVariant(props),
					isFocusVisible && 'ring-1 ring-stone-50',
					isDisabled && 'brightness-75 cursor-not-allowed',
					className,
				)}
			>
				{children}
			</button>
		);
	},
);

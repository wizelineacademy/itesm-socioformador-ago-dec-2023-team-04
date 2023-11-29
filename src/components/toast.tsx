'use client';
import React, {createContext, type ReactNode, useContext, useRef} from 'react';
import {type ToastState, useToastState} from '@react-stately/toast';
import {type AriaToastProps, type AriaToastRegionProps, useToast, useToastRegion} from '@react-aria/toast';
import {motion, type Variants} from 'framer-motion';
import {omit} from 'lodash';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import {cx} from '@/lib/cva.ts';

export type ToastContent = {
	variant?: 'success' | 'warn' | 'error';
	title: string;
	description?: string;
};

type ToastProps = {
	readonly state: ToastState<ToastContent>;
} & AriaToastProps<ToastContent>;

const toastVariants: Variants = {
	entering: {
		opacity: 1,
		top: 'auto',
		bottom: 'auto',
	},
	queued: {
		opacity: 1,
		top: 'auto',
		bottom: 'auto',
	},
	exiting(fromQueue: boolean) {
		const test = ({
			opacity: fromQueue ? 0 : 1,
			top: fromQueue ? -128 : 'auto',
			bottom: fromQueue ? 'auto' : 128,
		});

		console.log(test);

		return test;
	},
};

function Toast(props: ToastProps) {
	const {state, toast} = props;
	const {animation, content} = toast;
	const {title, description, variant = 'success'} = content;
	const ref = useRef<HTMLDivElement>(null);
	const {
		toastProps,
		titleProps,
		descriptionProps,
		closeButtonProps,
	} = useToast(props, state, ref);

	return (
		<motion.div
			{...omit(toastProps, ['onAnimationEnd', 'onAnimationStart', 'onDragStart', 'onDragEnd', 'onDrag'])}
			ref={ref}
			layout
			custom={animation === 'queued'}
			initial='exiting'
			variants={toastVariants}
			animate={animation}
			className={cx(
				'rounded flex p-2 items-center gap-2 relative',
				variant === 'success' && 'bg-green-400',
				variant === 'error' && 'bg-red-400',
				variant === 'warn' && 'bg-yellow-400',
			)}
			onAnimationComplete={() => {
				if (animation === 'exiting') {
					state.remove(props.toast.key);
				}
			}}
		>
			<div>
				<div {...titleProps} className='text-stone-800 font-semibold'>
					{title}
				</div>
				{
					description && (
						<div {...descriptionProps} className='text-stone-700'>
							{description}
						</div>
					)
				}
			</div>

			<Button
				{...closeButtonProps} variant='text' color='tertiary'
				size='xs' className={cx(
					'text-stone-800',
					variant === 'success' && 'enabled:hover:bg-green-500',
					variant === 'warn' && 'enabled:hover:bg-yellow-500',
					variant === 'error' && 'enabled:hover:bg-red-500',
				)}
			>
				<Icon size='sm' name='close'/>
			</Button>
		</motion.div>
	);
}

type ToastRegionProps = {
	readonly state: ToastState<ToastContent>;
} & AriaToastRegionProps;

function ToastRegion(props: ToastRegionProps) {
	const {state} = props;
	const ref = useRef<HTMLDivElement>(null);

	const {regionProps} = useToastRegion(props, state, ref);
	return (
		<motion.div
			{...omit(regionProps, ['onAnimationEnd', 'onAnimationStart', 'onDragStart', 'onDragEnd', 'onDrag'])}
			ref={ref}
			layout
			className='fixed bottom-4 right-4 flex flex-col gap-4 outline-none'
		>
			{
				state.visibleToasts.map(
					toast => (
						<Toast key={toast.key} toast={toast} state={state}/>
					),
				)
			}
		</motion.div>
	);
}

const toastContext = createContext<ToastState<ToastContent> | null>(null);

export function useToasts() {
	const toasts = useContext(toastContext);
	if (toasts === null) {
		throw new Error('useToast must be called within a ToastProvider');
	}

	return toasts;
}

export type ToastProviderProps = {
	readonly children: ReactNode;
};

export function ToastProvider(props: ToastProviderProps) {
	const {children} = props;
	const state = useToastState<ToastContent>({
		maxVisibleToasts: 5,
		hasExitAnimation: true,
	});

	return (
		<>
			<toastContext.Provider value={state}>
				{children}
			</toastContext.Provider>
			{
				state.visibleToasts.length > 0 && (
					<ToastRegion {...props} state={state}/>
				)
			}
		</>

	);
}

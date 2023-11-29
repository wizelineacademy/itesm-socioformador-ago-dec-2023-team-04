import React, {type ReactNode, useEffect, useMemo} from 'react';
import {FormValidationContext} from 'react-stately';
import {useFormState, useFormStatus} from 'react-dom';
import {Seq} from 'immutable';
import {type ToastContent, useToasts} from '@/components/toast.tsx';

export type FormState<T> = {
	readonly success: boolean;
	readonly formErrors: string[];
	readonly fieldErrors: {
		[K in keyof T]?: string[];
	};
};

type FormSubmitListenerProps<T> = {
	readonly state: FormState<T>;
	readonly successToast: ToastContent;
};

function FormSubmitListener<T>(props: FormSubmitListenerProps<T>) {
	const {successToast, state} = props;

	const {pending} = useFormStatus();
	const {add} = useToasts();

	useEffect(() => {
		if (state.success && !pending) {
			add(successToast, {timeout: 5000});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [state.success, pending]);

	return null;
}

export type FormProps<T> = {
	readonly children: ReactNode;
	readonly action: (previousState: FormState<T>, data: FormData) => Promise<FormState<T>>;
	readonly staticValues?: Partial<T>;

	readonly successToast?: ToastContent;
};

export default function Form<T>(props: FormProps<T>) {
	const {children, action, staticValues, successToast} = props;
	const [state, formAction] = useFormState(action, {
		success: false,
		formErrors: [],
		fieldErrors: {},
	});

	const {
		formErrors,
		fieldErrors,
	} = state;

	const processedStaticValues = useMemo(() => staticValues === undefined
		? []
		: Seq(Object.entries(staticValues)).filter(([, value]) => value !== undefined).map(
			([key, value]) => {
				if (typeof value === 'boolean') {
					return [key, value ? 'true' : 'false'] as const;
				}

				if (value instanceof Date) {
					return [key, value.toString()] as const;
				}

				if (typeof value === 'object') {
					return [key, JSON.stringify(value)] as const;
				}

				if (typeof value === 'string' || typeof value === 'number') {
					return [key, value] as const;
				}

				throw new Error('failed to process static values for form');
			},
		).toArray(), [staticValues]);

	return (
		<form action={formAction}>
			{
				processedStaticValues.map(([key, value]) => (
					<input key={key} readOnly hidden name={key} value={value}/>
				))
			}

			{
				formErrors.length > 0 && <div className='rounded bg-red-400 text-stone-50 p-2 mb-4'>
					{formErrors.join(' ')}
				</div>
			}
			{successToast && <FormSubmitListener state={state} successToast={successToast}/>}
			<FormValidationContext.Provider
				// @ts-expect-error fieldErrors is of a correct type, provider is wrongly typed.
				value={fieldErrors}
			>
				{children}
			</FormValidationContext.Provider>
		</form>
	);
}

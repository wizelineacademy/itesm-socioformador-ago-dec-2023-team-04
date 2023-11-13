import React, {type ReactNode} from 'react';
import {FormValidationContext} from 'react-stately';
import {useFormState} from 'react-dom';

export type FormState<T> = {
	readonly id?: number;
	readonly formErrors: string[];
	readonly fieldErrors: {
		[K in keyof T]?: string[];
	};
};

type ValidFormValues = string | boolean | string[] | number | undefined | null;

export type FormProps<T> = {
	readonly children: ReactNode;
	readonly id?: number;
	readonly action: (previousState: FormState<T>, data: FormData) => Promise<FormState<T>>;
	readonly staticValues?: {
		readonly [K in keyof T]?: ValidFormValues;
	};
};

export default function Form<T>(props: FormProps<T>) {
	const {children, action, staticValues, id} = props;
	const [state, formAction] = useFormState(action, {
		id,
		formErrors: [],
		fieldErrors: {},
	});

	const {
		formErrors,
		fieldErrors,
	} = state;

	return (
		<form action={formAction}>
			{
				staticValues && Object.entries(staticValues).map(([key, value]) => (
					value === undefined
						? null
						: <input key={key} readOnly hidden name={key} value={typeof value === 'boolean' ? (value ? 'on' : 'off') : value as string | string[] | number | null ?? ''}/>
				))
			}

			{
				formErrors.length > 0 && <div className='rounded bg-red-400 text-stone-50'>
					{formErrors.join(' ')}
				</div>
			}
			<FormValidationContext.Provider
				// @ts-expect-error fieldErrors is of a correct type, provider is wrongly typed.
				value={fieldErrors}
			>
				{children}
			</FormValidationContext.Provider>
		</form>
	);
}

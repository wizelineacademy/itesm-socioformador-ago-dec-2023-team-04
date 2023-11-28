import React, {type ReactNode, useMemo} from 'react';
import {FormValidationContext} from 'react-stately';
import {useFormState} from 'react-dom';
import {Seq} from 'immutable';

export type FormState<T> = {
	readonly formErrors: string[];
	readonly fieldErrors: {
		[K in keyof T]?: string[];
	};
};

export type FormProps<T> = {
	readonly children: ReactNode;
	readonly action: (previousState: FormState<T>, data: FormData) => Promise<FormState<T>>;
	readonly staticValues?: Partial<T>;
};

export default function Form<T>(props: FormProps<T>) {
	const {children, action, staticValues} = props;
	const [state, formAction] = useFormState(action, {
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
					return [key, value ? 'true' : ''] as const;
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

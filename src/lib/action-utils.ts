import {ZodError} from 'zod';
import {type FormState} from '@/components/form.tsx';

export async function handleActionError<T>(previousState: FormState<T>, error: unknown): Promise<FormState<T>> {
	if (error instanceof ZodError) {
		return {
			...previousState,
			...error.formErrors,
		};
	}

	if (error instanceof Error) {
		return {
			...previousState,
			formErrors: [error.message],
			fieldErrors: {},
		};
	}

	return {
		...previousState,
		formErrors: ['Unknown form error'],
		fieldErrors: {},
	};
}

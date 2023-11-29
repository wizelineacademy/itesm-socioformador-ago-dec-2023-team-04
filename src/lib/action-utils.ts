import {ZodError} from 'zod';
import {type FormState} from '@/components/form.tsx';

export async function handleActionError<T>(previousState: FormState<T>, error: unknown): Promise<FormState<T>> {
	if (error instanceof ZodError) {
		return {
			...previousState,
			...error.formErrors,
			success: false,
		};
	}

	if (error instanceof Error) {
		return {
			...previousState,
			formErrors: [error.message],
			fieldErrors: {},
			success: false,
		};
	}

	return {
		...previousState,
		formErrors: ['Unknown form error'],
		fieldErrors: {},
		success: false,
	};
}

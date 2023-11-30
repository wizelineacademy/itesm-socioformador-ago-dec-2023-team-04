import {ZodError} from 'zod';
import {expect, test} from '@jest/globals';
import {handleActionError} from '@/lib/action-utils.ts';

describe('handleActionError', () => {
	const initialState = {
		success: false,
		formErrors: [],
		fieldErrors: {},
	};

	test('should handle ZodError correctly', async () => {
		const zodError = new ZodError([]); // Simulate an empty ZodError
		const nextState = await handleActionError(initialState, zodError);

		// Ensure the ZodError is handled correctly
		expect(nextState.formErrors).toEqual([]);
		expect(nextState.fieldErrors).toEqual({});
	});

	test('should handle general Error correctly', async () => {
		const error = new Error('Test error message');
		const nextState = await handleActionError(initialState, error);

		// Ensure the general Error is handled correctly
		expect(nextState.formErrors).toEqual(['Test error message']);
		expect(nextState.fieldErrors).toEqual({});
	});

	test('should handle unknown error correctly', async () => {
		const unknownError = {}; // Simulate an unknown error
		const nextState = await handleActionError(initialState, unknownError);

		// Ensure unknown error is handled correctly
		expect(nextState.formErrors).toEqual(['Unknown form error']);
		expect(nextState.fieldErrors).toEqual({});
	});
});

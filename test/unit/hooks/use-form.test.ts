import { renderHook } from '@testing-library/react';
import {expect, jest, test} from '@jest/globals';
import { useForm } from '@/lib/hooks/use-form.ts';

describe('useForm', () => {
	test('should return initial form values and handlers', () => {
		const onSubmitMock = jest.fn().mockResolvedValue({ success: true });

		const { result } = renderHook(() =>
			useForm({
				schema: , // Zod schema
				entity: , // initial entity data
				onSubmit: onSubmitMock,
			})
		);

		// Assert initial form values
		expect(result.current.values).toEqual(); /

		// Assert the presence and types of handlers
		expect(typeof result.current.changeHandler).toBe('object');
		expect(typeof result.current.blurHandler).toBe('object');
		expect(typeof result.current.submitHandler).toBe('function');

	});

});

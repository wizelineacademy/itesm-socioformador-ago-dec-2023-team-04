import { renderHook } from '@testing-library/react';
import {expect, test} from '@jest/globals';
import useStaticContent from '@/lib/hooks/use-static-content.ts';

describe('useStaticContent hook', () => {
	test('should return isHydrating as true on initial render', () => {
		const { result } = renderHook(() => useStaticContent());

		const [isHydrating, ref] = result.current;

		expect(isHydrating).toBe(true);
		expect(ref.current).toBeUndefined();
	});

	test('should update isHydrating to false when innerHTML is not empty', () => {
		const { result } = renderHook(() => useStaticContent());

		const div = document.createElement('div');
		div.innerHTML = '<p>Some content</p>';

		Object.defineProperty(global.document, 'createElement', {
			value: jest.fn().mockReturnValue(div),
		});

		const [isHydrating, ref] = result.current;

		expect(isHydrating).toBe(false);
		expect(ref.current).toBeDefined();
	});

});

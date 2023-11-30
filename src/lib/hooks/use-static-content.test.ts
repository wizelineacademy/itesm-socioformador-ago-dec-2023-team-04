import {render, renderHook} from '@testing-library/react';
import {expect, test} from '@jest/globals';
import useStaticContent from '@/lib/hooks/use-static-content.ts';

describe('useStaticContent hook', () => {
	test('should return isHydrating as true on initial render', () => {
		const {result} = renderHook(() => useStaticContent());

		const [isHydrating, ref] = result.current;

		expect(isHydrating).toBe(false);
		expect(ref.current).toBeUndefined();
	});

	test('should update isHydrating to false when innerHTML is not empty', () => {
		const div = document.createElement('div');
		div.innerHTML = '<p>Some content</p>';

		const {result} = renderHook(() => {
			const result = useStaticContent();
			result[1].current = div;
			return result;
		});

		const [isHydrating, ref] = result.current;
		ref.current = div;

		expect(isHydrating).toBe(false);
		expect(ref.current).toBeDefined();
	});
});

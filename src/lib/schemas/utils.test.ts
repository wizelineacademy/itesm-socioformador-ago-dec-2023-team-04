import {expect, test} from '@jest/globals';
import {preprocessFormValue} from '@/lib/schemas/utils.ts';

describe('preprocessFormValue function', () => {
	test('should convert empty strings to undefined', () => {
		expect(preprocessFormValue('')).toBeUndefined();
	});

	test('should return number for number values', () => {
		expect(preprocessFormValue(42)).toBe(42);
	});

	test('should return strings as they are', () => {
		expect(preprocessFormValue('  test  ')).toBe('  test  ');
	});
});


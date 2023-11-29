import {expect, test} from '@jest/globals';
import { preprocessFormValue } from '@/lib/schemas/utils.ts';

describe('preprocessFormValue function', () => {
	test('should convert empty strings to undefined', () => {
		expect(preprocessFormValue('')).toBeUndefined();
	});

	test('should return null for non-string values', () => {
		expect(preprocessFormValue(42)).toBeNull();
	});

	test('should trim whitespace from strings', () => {
		expect(preprocessFormValue('  test  ')).toBe('test');
	});

});


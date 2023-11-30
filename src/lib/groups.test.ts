import {expect, test} from '@jest/globals';
import groupInitSchema from '@/lib/schemas/group.ts';

describe('Group Initialization Schema Validation', () => {
	test('should validate a valid group initialization object', () => {
		const validGroupInit = {
			name: 'Test Group',
			active: true,
			description: 'This is an example group.',
			entryHour: '12:00', // Example time input
			duration: 60, // Example duration in minutes
			tz: 'UTC', // Example timezone
			colorId: 1, // Example color ID

			students: JSON.stringify([1, 2, 3]),
			users: JSON.stringify([4, 5, 6]),

			enabledMonday: true,
			enabledTuesday: true,
			enabledWednesday: true,
			enabledThursday: true,
			enabledFriday: true,
			enabledSaturday: false,
			enabledSunday: false,
		};

		const validationResult = groupInitSchema.safeParse(validGroupInit);
		expect(validationResult.success).toBe(true);
	});

	test('should invalidate an invalid group initialization object', () => {
		const invalidGroupInit = {
			name: 'Another Group',
			active: 'yes', // Invalid type
			description: 123, // Invalid type
			entryHour: '22:00', // Invalid time
			duration: -10, // Negative duration
			tz: 'InvalidTZ', // Invalid timezone
			colorId: 'red', // Invalid type

			students: JSON.stringify(['a', 'b', 'c']), // Invalid student data
			users: 'invalidJSON', // Invalid JSON format

			enabledMonday: true,
			enabledTuesday: true,
			enabledWednesday: 'yes', // Invalid type
			enabledThursday: true,
			enabledFriday: false,
			enabledSaturday: false,
			enabledSunday: true, // Invalid type
		};

		const validationResult = groupInitSchema.safeParse(invalidGroupInit);
		expect(validationResult.success).toBe(false);
	});
});

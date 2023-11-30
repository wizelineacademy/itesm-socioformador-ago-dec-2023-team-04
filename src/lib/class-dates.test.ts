// Class-dates.test.ts
// import { toDate } from '@internationalized/date';
import {CalendarDate, today} from '@internationalized/date';
import {expect, test} from '@jest/globals';
import {getGroupClassDate, groupHasClass, type GroupDates} from '@/app/groups/class-dates.ts';

describe('getGroupClassDate', () => {
	const mockGroup: GroupDates = {
		enabledSunday: false,
		enabledMonday: false,
		enabledTuesday: false,
		enabledWednesday: true,
		enabledThursday: false,
		enabledFriday: true,
		enabledSaturday: false,
	};

	test('should return previous correct class date with no offset and base date', () => {
		// Define a specific base date for testing
		const baseDate = new CalendarDate(2023, 11, 27); // Specific date string

		// Assuming an offset of 0
		const result = getGroupClassDate(mockGroup, 0, baseDate);

		// Expected result based on the specific date provided
		const expectedDate = new CalendarDate(2023, 11, 24);

		//   Assertions  to validate the result against expectations
		expect(result).toEqual(expectedDate);
	});
	test('should return previous correct class date with offset 1 and base date', () => {
		// Define a specific base date for testing
		const baseDate = new CalendarDate(2023, 11, 27); // Specific date string

		// Assuming an offset of 0
		const result = getGroupClassDate(mockGroup, -2, baseDate);

		// Expected result based on the specific date provided
		const expectedDate = new CalendarDate(2023, 11, 20);

		//   Assertions  to validate the result against expectations
		expect(result).toEqual(expectedDate);
	});
});

describe('groupHasClass', () => {
	const mockGroup: GroupDates = {
		enabledSunday: true,
		enabledMonday: false,
		enabledTuesday: true,
		enabledWednesday: false,
		enabledThursday: true,
		enabledFriday: false,
		enabledSaturday: true,
	};

	test('should return true when the group has class on the specific date', () => {
		// Define a specific base date for testing
		const baseDate = new CalendarDate(2023, 11, 28); // Specific date string

		const result = groupHasClass(mockGroup, baseDate);

		// Assertions  to validate the result against expectations
		expect(result).toBeTruthy();
	});
});

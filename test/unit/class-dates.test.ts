// class-dates.test.ts
import { getGroupClassDate, groupHasClass, GroupDates } from '@/app/groups/class-dates.ts';
//import { today } from '@internationalized/date';
import {toDate} from '@internationalized/date';
import {expect, jest, test} from '@jest/globals';



describe('getGroupClassDate', () => {
	const mockGroup: GroupDates = {
		enabledSunday: true,
		enabledMonday: false,
		enabledTuesday: true,
		enabledWednesday: false,
		enabledThursday: true,
		enabledFriday: false,
		enabledSaturday: true,
	};

	test('should return correct class date with specific offset and base date', () => {
		// Define a specific base date for testing
		const baseDate = toDate('2023-12-01'); // specific date string

		// Assuming an offset of 0
		const result = getGroupClassDate(mockGroup, 0, baseDate);

		//expected result based on the specific date provided
		const expectedDate = toDate('2023-12-01'); // Replace with the expected date string

		//   assertions  to validate the result against expectations
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
		const baseDate = toDate('2023-12-01'); //specific date string

		const result = groupHasClass(mockGroup, baseDate);

		// assertions  to validate the result against expectations
		expect(result).toBe(true);
	});
});

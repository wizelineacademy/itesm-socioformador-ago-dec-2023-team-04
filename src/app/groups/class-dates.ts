import {type Group} from '@prisma/client';
import {
	getDayOfWeek,
	getLocalTimeZone,
	isSameDay,
	Time,
	toCalendarDateTime,
	today,
} from '@internationalized/date';

const dayAccesor = ['enabledSunday', 'enabledMonday', 'enabledTuesday', 'enabledWednesday', 'enabledThursday', 'enabledFriday', 'enabledSaturday'] as const;

export type GroupDates = Pick<Group, 'enabledSunday' | 'enabledMonday' | 'enabledTuesday' | 'enabledWednesday' | 'enabledThursday' | 'enabledFriday' | 'enabledSaturday'>;

export type GroupSchedule = Pick<Group, 'entryHour' | 'exitHour'>;

export function getGroupClassDate(group: GroupDates, offset = 0, baseDate = today(getLocalTimeZone())) {
	const dayOfTheWeek = getDayOfWeek(baseDate, 'en-US');

	let daysActive = 0;
	for (const day of dayAccesor) {
		daysActive += group[day] ? 1 : 0;
	}

	if (daysActive === 0) {
		return undefined;
	}

	if (offset === 0 && groupHasClass(group, baseDate)) {
		return baseDate;
	}

	const adjustedOffset = offset === 0 ? -1 : offset;

	const weekOffset = Math.trunc(adjustedOffset / daysActive);
	let activeDayOffset = adjustedOffset % daysActive;
	let dayOffset = 0;

	while (activeDayOffset !== 0) {
		dayOffset += Math.sign(adjustedOffset);

		let relativeDay = dayOfTheWeek + dayOffset;
		relativeDay = relativeDay < 0 ? relativeDay + 7 : relativeDay;
		relativeDay = relativeDay > 6 ? relativeDay - 7 : relativeDay;
		const dayIsEnabled = group[dayAccesor[relativeDay]];

		if (dayIsEnabled) {
			activeDayOffset -= Math.sign(adjustedOffset);
		}
	}

	return baseDate.add({
		weeks: weekOffset,
		days: dayOffset,
	});
}

export function groupHasClass(group: GroupDates, baseDate = today(getLocalTimeZone())) {
	const dayOfTheWeek = getDayOfWeek(baseDate, 'en-US');

	return group[dayAccesor[dayOfTheWeek]];
}

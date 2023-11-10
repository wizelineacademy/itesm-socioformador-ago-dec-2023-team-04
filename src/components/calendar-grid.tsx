import React from 'react';
import {type AriaCalendarGridProps, useCalendarGrid, useLocale} from 'react-aria';
import {getWeeksInMonth} from '@internationalized/date';
import {type RangeCalendarState} from 'react-stately';
import CalendarCell from '@/components/calendar-cell.tsx';

export type CalendarGridProps = {
	readonly state: RangeCalendarState;
} & AriaCalendarGridProps;

export default function CalendarGrid({state, ...props}: CalendarGridProps) {
	const {locale} = useLocale();
	const {gridProps, headerProps, weekDays} = useCalendarGrid(props, state);

	// Get the number of weeks in the month so we can render the proper number of rows.
	const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

	return (
		<table {...gridProps}>
			<thead {...headerProps}>
				<tr>
					{/* eslint-disable-next-line react/no-array-index-key */}
					{weekDays.map((day, index) => <th key={index}> {day} </th>)}
				</tr>
			</thead>
			<tbody>
				{[...Array.from({length: weeksInMonth}).keys()].map(weekIndex => (
					<tr key={weekIndex}>
						{state.getDatesInWeek(weekIndex).map((date, i) => (
							date
								? (
							/* eslint-disable-next-line react/no-array-index-key */
									<CalendarCell key={i} state={state} date={date}/>
								)
							// eslint-disable-next-line react/no-array-index-key
								: <td key={i}/>
						))}
					</tr>
				))}
			</tbody>
		</table>
	);
}

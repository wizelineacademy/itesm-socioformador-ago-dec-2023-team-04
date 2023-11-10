import React from 'react';
import {type AriaCalendarCellProps, useCalendarCell} from 'react-aria';
import {type RangeCalendarState} from 'react-stately';
import {cx} from '@/lib/cva.ts';

export type CalendarCellProps = {
	readonly state: RangeCalendarState;
} & AriaCalendarCellProps;

export default function CalendarCell({state, date}: CalendarCellProps) {
	const ref = React.useRef(null);
	const {
		cellProps,
		buttonProps,
		isSelected,
		isOutsideVisibleRange,
		isDisabled,
		isUnavailable,
		formattedDate,
	} = useCalendarCell({date}, state, ref);

	return (
		<td {...cellProps}>
			<div
				{...buttonProps}
				ref={ref}
				hidden={isOutsideVisibleRange}
				className={cx(
					'flex text-stone-400 justify-center align-middle',
					isSelected && 'selected',
					isDisabled && 'disabled',
					isUnavailable && 'unavailable')}
			>
				{formattedDate}
			</div>
		</td>
	);
}

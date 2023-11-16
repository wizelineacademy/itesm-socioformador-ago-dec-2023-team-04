import React from 'react';
import {type AriaCalendarCellProps, useCalendarCell, useFocusRing, useLocale} from 'react-aria';
import {type RangeCalendarState} from 'react-stately';
import {isSameDay, getDayOfWeek} from '@internationalized/date';
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
		formattedDate,
		isInvalid,
	} = useCalendarCell({date}, state, ref);

	const isSelectionStart = state.highlightedRange
		? isSameDay(date, state.highlightedRange.start)
		: isSelected;
	const isSelectionEnd = state.highlightedRange
		? isSameDay(date, state.highlightedRange.end)
		: isSelected;

	const {locale} = useLocale();
	const dayOfWeek = getDayOfWeek(date, locale);
	const isLeft
		= isSelected && (isSelectionStart || dayOfWeek === 0 || date.day === 1);
	const isRight
		= isSelected
		&& (isSelectionEnd
			|| dayOfWeek === 6
			|| date.day === date.calendar.getDaysInMonth(date));

	const {isFocusVisible} = useFocusRing();

	return (
		<td
			{...cellProps} className={cx('relative p-0 py-1')}
		>
			<div
				{...buttonProps}
				ref={ref}
				hidden={isOutsideVisibleRange}
				className={cx('flex p-1 w-8 text-sm text-stone-400 justify-center justify-items-end items-center align-middle',
					isDisabled && !isInvalid && 'text-stone-400',
					isDisabled && 'text-stone-600',
					// Focus ring, visible while the cell has keyboard focus.
					isFocusVisible && 'ring-2 group-focus:z-2 ring-wRed-500 ring-offset-2',
					isSelected && 'text-stone-50 bg-wRed-500',
					// Darker selection background for the start and end.
					(isLeft) && ' rounded-l-xl',
					(isRight) && ' rounded-r-xl',
					// Hover state for non-selected cells.
					!isSelected && !isDisabled && 'hover:bg-wRed-100',
				)}
			>
				{formattedDate}
			</div>
		</td>
	);
}

import React, {type ReactNode} from 'react';
import {
    useCalendar,
    useLocale,
    useCalendarGrid,
    useCalendarCell,
    type AriaCalendarProps,
    type AriaCalendarGridProps, AriaCalendarCellProps, CalendarCellAria,
} from 'react-aria';
import {type CalendarState, useCalendarState} from 'react-stately';
import {createCalendar, type DateValue, getWeeksInMonth} from '@internationalized/date';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';

type CalendarProps = {
    readonly calendarProps: ReactNode;
    readonly nextButtonProps: ReactNode;
    readonly prevButtonProps: ReactNode;
    readonly errorMessage?: ReactNode;
    readonly title: ReactNode;
} & AriaCalendarProps<DateValue>;

export function Calendar(props: CalendarProps) {
    const {locale} = useLocale();
    const state = useCalendarState({
        ...props,
        locale,
        createCalendar,
    });

    const {calendarProps, prevButtonProps, nextButtonProps, title} = useCalendar(
        props,
        state,
    );

    return (
        <div {...calendarProps} className='calendar'>
            <div className='header'>
                <Button color='secondary'><Icon name='navigate_before'/></Button>
                <h2>{title}</h2>
                <Button color='secondary'><Icon name='navigate_next'/></Button>
            </div>
            <CalendarGrid state={state} props={}/>
        </div>
    );
}

type CalendarGridProps = {
    readonly state: CalendarState;
    readonly props: AriaCalendarGridProps;
} & AriaCalendarGridProps;

function CalendarGrid({state, ...props}: CalendarGridProps) {
    const {locale} = useLocale();
    const {gridProps, headerProps, weekDays} = useCalendarGrid(props, state);

    // Get the number of weeks in the month so we can render the proper number of rows.
    const weeksInMonth = getWeeksInMonth(state.visibleRange.start, locale);

    return (
        <table {...gridProps}>
            <thead {...headerProps}>
            <tr>
                {/* eslint-disable-next-line react/no-array-index-key */}
                {weekDays.map((day, index) => <th key={index}>{day}</th>)}
            </tr>
            </thead>
            <tbody>
            {[...new Array(weeksInMonth).keys()].map(weekIndex => (
                <tr key={weekIndex}>
                    {state.getDatesInWeek(weekIndex).map((date, i) => (
                        date
                            ? (
                                <CalendarCell
                                    {/* eslint-disable-next-line react/no-array-index-key */}
                                    key={i}
                                    state={state}
                                    date={date}
                                />
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

type CalendarCellProps = {
    readonly state: CalendarState;
    readonly props: AriaCalendarCellProps;
} & AriaCalendarCellProps;

function CalendarCell({state, date}: CalendarCellProps) {
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
                className={`cell ${isSelected ? 'selected' : ''} ${
                    isDisabled ? 'disabled' : ''
                } ${isUnavailable ? 'unavailable' : ''}`}
            >
                {formattedDate}
            </div>
        </td>
    );
}

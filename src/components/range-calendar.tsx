import React from 'react';
import {type RangeCalendarProps, useLocale, useRangeCalendar} from 'react-aria';
import {useRangeCalendarState} from 'react-stately';
import {createCalendar, type DateValue} from '@internationalized/date';
import {Button} from '@/components/button.tsx';
import CalendarGrid from '@/components/calendar-grid.tsx';
import Icon from '@/components/icon.tsx';

export default function RangeCalendar(props: RangeCalendarProps<DateValue>) {
	const {locale} = useLocale();
	const state = useRangeCalendarState({
		...props,
		locale,
		createCalendar,
	});

	const ref = React.useRef(null);
	const {calendarProps, prevButtonProps, nextButtonProps, title} =
		useRangeCalendar(props, state, ref);
	return (
		<div {...calendarProps} ref={ref} className="calendar">
			<div className='header'>
				<Button {...prevButtonProps}><Icon name='navigate_before'/></Button>
				<h2>{title}</h2>
				<Button {...nextButtonProps}><Icon name='navigate_next'/></Button>
			</div>
			<CalendarGrid state={state}/>
		</div>
	)
}
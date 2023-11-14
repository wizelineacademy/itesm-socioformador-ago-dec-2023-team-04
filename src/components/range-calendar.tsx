import React from 'react';
import {
	useRangeCalendar,
	useLocale,
	type AriaRangeCalendarProps,
} from 'react-aria';
import {useRangeCalendarState} from 'react-stately';
import {createCalendar, type DateValue} from '@internationalized/date';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import CalendarGrid from '@/components/calendar-grid.tsx';

export default function RangeCalendar(props: AriaRangeCalendarProps<DateValue>) {
	const {locale} = useLocale();
	const state = useRangeCalendarState({
		...props,
		locale,
		createCalendar,
	});

	const ref = React.useRef(null);
	const {calendarProps, prevButtonProps, nextButtonProps, title} = useRangeCalendar(
		props,
		state,
		ref,
	);

	return (
		<div {...calendarProps} ref={ref} className='calendar'>
			<div className='header flex justify-between items-center'>
				<Button variant='text' color='tertiary' {...prevButtonProps}><Icon name='navigate_before'/></Button>
				<h2 className='text-stone-300 first-letter:uppercase'>{title}</h2>
				<Button variant='text' color='tertiary' {...nextButtonProps}><Icon name='navigate_next'/></Button>
			</div>
			<CalendarGrid state={state}/>
		</div>
	);
}

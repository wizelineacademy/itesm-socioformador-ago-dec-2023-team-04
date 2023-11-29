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
	const {calendarProps, prevButtonProps, nextButtonProps, title}
		= useRangeCalendar(props, state, ref);
	return (
		<div {...calendarProps} ref={ref}>
			<div className='header flex items-center justify-between'>
				<Button variant='text' size='sm' color='tertiary' {...prevButtonProps}><Icon name='navigate_before'/></Button>
				<h2 className='text-stone-300 first-letter:capitalize'>{title}</h2>
				<Button variant='text' size='sm' color='tertiary' {...nextButtonProps}><Icon name='navigate_next'/></Button>
			</div>
			<CalendarGrid state={state}/>
		</div>
	);
}

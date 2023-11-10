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
import {cx} from '@/lib/cva.ts';

type RangeCalendarProps = {
	readonly className?: string;
} & AriaRangeCalendarProps<DateValue>;

export function RangeCalendar(props: RangeCalendarProps) {
	const {className} = props;
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
			<div className='header'>
				<Button color='secondary' {...prevButtonProps}><Icon name='navigate_before'/></Button>
				<h2>{title}</h2>
				<Button color='secondary' {...nextButtonProps}><Icon name='navigate_next'/></Button>
			</div>
			<CalendarGrid state={state}/>
		</div>
	);
}
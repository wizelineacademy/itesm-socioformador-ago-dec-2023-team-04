import React, {type ReactNode} from 'react';
import {
	useCalendar,
	useLocale,
	type AriaCalendarProps,
} from 'react-aria';
import {useCalendarState} from 'react-stately';
import {createCalendar, type DateValue} from '@internationalized/date';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import CalendarGrid from '@/components/calendar-grid.tsx';

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
				<Button variant='text' color='tertiary' {...prevButtonProps}><Icon name='navigate_before'/></Button>
				<h2 className='text-stone-300 first-letter:capitalize'>{title}</h2>
				<Button variant='text' color='tertiary' {...nextButtonProps}><Icon name='navigate_next'/></Button>
			</div>
			<CalendarGrid state={state}/>
		</div>
	);
}

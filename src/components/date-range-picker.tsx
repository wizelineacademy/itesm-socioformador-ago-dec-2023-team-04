import React from 'react';
import {type AriaDateRangePickerProps, useDateRangePicker} from 'react-aria';
import {useDateRangePickerState} from 'react-stately';
import {type DateValue} from '@internationalized/date';
import DateField from '@/components/date-field.tsx';
import {Button} from '@/components/button.tsx';
import Popover from '@/components/popover.tsx';
import Dialog from '@/components/dialog.tsx';
import RangeCalendar from '@/components/range-calendar.tsx';
import Icon from '@/components/icon.tsx';

export default function DateRangePicker(props: AriaDateRangePickerProps<DateValue>) {
	const state = useDateRangePickerState(props);
	const ref = React.useRef(null);
	const {
		groupProps,
		labelProps,
		startFieldProps,
		endFieldProps,
		buttonProps,
		dialogProps,
		calendarProps,
	} = useDateRangePicker(props, state, ref);

	return (
		<div style={{display: 'inline-flex', flexDirection: 'column'}}>
			<div {...labelProps}>{props.label}</div>
			<div
				{...groupProps} ref={ref}
				className='flex align-items-middle align-middle justify-between items-center'
			>
				<DateField {...startFieldProps}/>
				<span className='p-2 text-stone-400'>-</span>
				<DateField {...endFieldProps}/>
				{state.isInvalid && <span aria-hidden='true'>🚫</span>}
				<span className='p'/>
				<Button color='secondary' size='md' {...buttonProps}><Icon name='calendar_month'/></Button>
			</div>
			{state.isOpen && (
				<Popover state={state} triggerRef={ref} placement='bottom start'>
					<Dialog {...dialogProps}>
						<RangeCalendar {...calendarProps}/>
					</Dialog>
				</Popover>
			)}
		</div>
	);
}

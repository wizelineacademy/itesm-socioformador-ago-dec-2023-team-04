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

function DatePicker(props: AriaDateRangePickerProps<DateValue>) {
	const state = useDateRangePickerState(props);
	const ref = React.useRef(null);
	const {
		labelProps,
		groupProps,
		startFieldProps,
		endFieldProps,
		buttonProps,
		dialogProps,
		calendarProps,
	} = useDateRangePicker(props, state, ref);

	return (
		<div style={{display: 'inline-flex', flexDirection: 'column'}}>
			<div {...labelProps}>{props.label}</div>
			<div {...groupProps} ref={ref} style={{display: 'flex'}}>
				<DateField {...startFieldProps}/>
				<span className='p-1'>-</span>
				<DateField {...endFieldProps}/>
				<Button color='secondary' {...buttonProps}><Icon name='calendar_month'/></Button>
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

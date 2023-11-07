import React, {type ReactNode} from 'react';
import {type AriaDatePickerProps, useDatePicker} from 'react-aria';
import {useDatePickerState} from 'react-stately';
import {type DateValue} from '@internationalized/date';
import DateField from '@/components/date-field.tsx';
import {Button} from '@/components/button.tsx';
import Popover from '@/components/popover.tsx';
import Dialog from '@/components/dialog.tsx';
import {Calendar} from '@/components/calendar.tsx';
import Icon from '@/components/icon.tsx';

export type DatePickerProps = {
	readonly label?: ReactNode;
	readonly groups: ReactNode;
	readonly field: ReactNode;
	readonly button: ReactNode;
	readonly description: ReactNode;
	readonly errorMessage: ReactNode;
	readonly dialog: ReactNode;
	readonly calendar: ReactNode;
} & AriaDatePickerProps<DateValue>;

function DatePicker(props: DatePickerProps) {
	const state = useDatePickerState(props);
	const ref = React.useRef(null);
	const {
		groupProps,
		labelProps,
		fieldProps,
		buttonProps,
		dialogProps,
		calendarProps,
	} = useDatePicker(props, state, ref);

	return (
		<div style={{display: 'inline-flex', flexDirection: 'column'}}>
			<div {...labelProps}>{props.label}</div>
			<div {...groupProps} ref={ref} style={{display: 'flex'}}>
				<DateField field={undefined} input={undefined} {...fieldProps}/>
				<Button color='secondary'><Icon name='calendar_month'/></Button>
			</div>
			{state.isOpen && (
				<Popover state={state} triggerRef={ref} placement='bottom start'>
					<Dialog {...dialogProps}>
						<Calendar
							calendarProps={undefined} nextButtonProps={undefined} prevButtonProps={undefined}
							title={undefined} {...calendarProps}/>
					</Dialog>
				</Popover>
			)}
		</div>
	);
}

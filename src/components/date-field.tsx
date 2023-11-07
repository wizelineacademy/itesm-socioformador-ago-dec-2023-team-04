import React, {type ReactNode} from 'react';
import {type AriaDateFieldProps, useDateField, useDateSegment, useLocale} from 'react-aria';
import {type DateFieldState, type DateSegment as DateSegmentProp, useDateFieldState} from 'react-stately';
import {createCalendar, type DateValue} from '@internationalized/date';

export type DateFieldProps = {
	readonly label?: ReactNode;
	readonly field: ReactNode;
	readonly input: ReactNode;
	readonly description?: ReactNode;
	readonly errorMessage?: ReactNode;
} & AriaDateFieldProps<DateValue>;

export default function DateField(props: DateFieldProps) {
	const {locale} = useLocale();
	const state = useDateFieldState({
		...props,
		locale,
		createCalendar,
	});

	const ref = React.useRef(null);
	const {labelProps, fieldProps} = useDateField(props, state, ref);

	return (
		<div className='wrapper'>
			<span {...labelProps}>{props.label}</span>
			<div {...fieldProps} ref={ref} className='field'>
				{state.segments.map((segment, i) => (
					// eslint-disable-next-line react/no-array-index-key
					<DateSegment key={i} segment={segment} state={state}/>
				))}
				{state.isInvalid && <span aria-hidden='true'>🚫</span>}
			</div>
		</div>
	);
}

type DateSegmentProps = {
	readonly segment: DateSegmentProp;
	readonly state: DateFieldState;
};

function DateSegment({segment, state}: DateSegmentProps) {
	const ref = React.useRef(null);
	const {segmentProps} = useDateSegment(segment, state, ref);

	return (
		<div
			{...segmentProps}
			ref={ref}
			className={`segment ${segment.isPlaceholder ? 'placeholder' : ''}`}
		>
			{segment.text}
		</div>
	);
}

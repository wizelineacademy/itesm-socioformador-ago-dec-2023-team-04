import React from 'react';
import {type AriaDateFieldProps, useDateField, useLocale} from 'react-aria';
import {useDateFieldState} from 'react-stately';
import {createCalendar, type DateValue} from '@internationalized/date';
import DateSegment from '@/components/date-segment.tsx';
import {cx} from '@/lib/cva.ts';

export type DateFieldProps = {
	readonly className?: string;
} & AriaDateFieldProps<DateValue>;

export default function DateField(props: DateFieldProps) {
	const {className} = props;
	const {locale} = useLocale();
	const state = useDateFieldState({
		...props,
		locale,
		createCalendar,
	});

	const ref = React.useRef(null);
	const {labelProps, fieldProps} = useDateField(props, state, ref);

	return (
		<div className={cx('w-fit group', className)}>
			<span
				{...labelProps}
				className='block group-focus-within:text-stone-50 text-stone-400 text-xs mb-1'
			>{props.label}</span>
			<div
				{...fieldProps} ref={ref}
				className='text-stone-300 w-fit flex bg-stone-700 rounded border border-stone-600 p-1 group-focus-within:border-stone-50'
			>
				{state.segments.map((segment, i) => (
					// eslint-disable-next-line react/no-array-index-key
					<DateSegment key={i} segment={segment} state={state}/>
				))}
				{state.isInvalid && <span aria-hidden='true'>🚫</span>}
			</div>
		</div>
	);
}

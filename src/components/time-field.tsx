import React from 'react';
import {type AriaTimeFieldProps, useLocale, useTimeField} from 'react-aria';
import {type Time} from '@internationalized/date';
import {type TimeFieldStateOptions, useTimeFieldState} from 'react-stately';
import DateSegment from '@/components/date-segment.tsx';
import {cx} from '@/lib/cva.ts';

export type TimeFieldProps = {
	readonly className?: string;
} & AriaTimeFieldProps<Time> & Omit<TimeFieldStateOptions<Time>, 'locale'>;

export default function TimeField(props: TimeFieldProps) {
	const {className} = props;
	const {locale} = useLocale();
	const state = useTimeFieldState({
		...props,
		locale,
	});
	const ref = React.useRef<HTMLDivElement>(null);
	const {labelProps, fieldProps} = useTimeField(props, state, ref);
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


import React from 'react';
import {type DateFieldState, type DateSegment as DateSegmentState} from 'react-stately';
import {useDateSegment} from 'react-aria';

export type DateSegmentProps = {
	readonly segment: DateSegmentState;
	readonly state: DateFieldState;
};

export default function DateSegment(props: DateSegmentProps) {
	const {segment, state} = props;
	const {isPlaceholder} = segment;
	const ref = React.useRef(null);
	const {segmentProps} = useDateSegment(segment, state, ref);

	return (
		<div
			{...segmentProps}
			ref={ref}
			className='focus:text-stone-700 focus:bg-stone-50 outline-none rounded px-1'
		>
			{segment.text}
		</div>
	);
}

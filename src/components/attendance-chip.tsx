import React from 'react';
import {AttendanceType} from '@prisma/client';
import {
	type CalendarDate,
	getLocalTimeZone,
	now,
	type Time, toCalendarDate,
	toCalendarDateTime,
	toTime,
	toZoned,
} from '@internationalized/date';
import {Item, type Key} from 'react-stately';
import Select from '@/components/select.tsx';

export type AttendanceValue = {
	date: CalendarDate;
	time: Time | null;
	type: AttendanceType;
};

export type AttendanceChipProps = {
	readonly date: CalendarDate;
	readonly entryTime: Time;
	readonly groupTz: string;
	// eslint-disable-next-line react/boolean-prop-naming
	readonly useCurrentTime?: boolean;
	readonly attendance: AttendanceValue | null;
	readonly onAttendanceChange: (attendance: AttendanceValue | null) => void;
	readonly className?: string;
};

export function AttendanceChip(props: AttendanceChipProps) {
	const {
		attendance,
		entryTime,
		groupTz,
		useCurrentTime = false,
		onAttendanceChange,
		date,
		className,
	} = props;

	// Const entryDateTime = toZoned(toCalendarDateTime(today(groupTz), fromDate(entryHour, groupTz)), groupTz);
	const currentDateTime = now(getLocalTimeZone());

	const selectHandler = (select: Key) => {
		if (select === 'absence') {
			onAttendanceChange(null);
			return;
		}

		onAttendanceChange({
			date,
			time: useCurrentTime ? toTime(now(getLocalTimeZone())) : null,
			type: select as AttendanceType,
		});
	};

	const selection = attendance === null ? 'absence' : attendance.type;

	return (
		<Select aria-label='Estado de asistencia' selectedKey={selection} className={className} isDisabled={toCalendarDate(currentDateTime) < date} onSelectionChange={selectHandler}>
			<Item key='absence' textValue='Pendiente'>
				{
					currentDateTime < toZoned(toCalendarDateTime(date, entryTime), groupTz)
						? (
							<div className='flex items-center'>
								<svg viewBox='0 0 4 4' className='w-3 h-3 inline me-2'>
									<circle cx='2' cy='2' r='2' className='fill-stone-400'/>
								</svg>
								Pendiente
							</div>
						)
						: (
							<div className='flex items-center'>
								<svg viewBox='0 0 4 4' className='w-3 h-3 inline me-2'>
									<circle cx='2' cy='2' r='2' className='fill-red-400'/>
								</svg>
								Falta
							</div>
						)
				}

			</Item>

			<Item key={AttendanceType.LATE} textValue='Tarde'>
				<div className='flex items-center'>
					<svg viewBox='0 0 4 4' className='w-3 h-3 inline me-2'>
						<circle cx='2' cy='2' r='2' className='fill-amber-400'/>
					</svg>
					Tarde
				</div>
			</Item>
			<Item key={AttendanceType.ON_TIME} textValue='A tiempo'>
				<div className='flex items-center'>
					<svg viewBox='0 0 4 4' className='w-3 h-3 inline me-2'>
						<circle cx='2' cy='2' r='2' className='fill-green-400'/>
					</svg>
					Presente
				</div>

			</Item>
		</Select>
	);
}

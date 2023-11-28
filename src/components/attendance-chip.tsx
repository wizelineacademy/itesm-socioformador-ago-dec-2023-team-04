import React from 'react';
import {AttendanceType} from '@prisma/client';
import {
	type CalendarDate, getDayOfWeek,
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

export type GroupValue = {
	enabledMonday: boolean;
	enabledTuesday: boolean;
	enabledWednesday: boolean;
	enabledThursday: boolean;
	enabledFriday: boolean;
	enabledSaturday: boolean;
	enabledSunday: boolean;
	entryTime: Time;
};

const daysOfTheWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] as const;

export type AttendanceChipProps = {
	readonly date: CalendarDate;
	readonly group: GroupValue;
	readonly serverTz: string;
	// eslint-disable-next-line react/boolean-prop-naming
	readonly useCurrentTime?: boolean;
	readonly attendance: AttendanceValue | null;
	readonly onAttendanceChange: (attendance: AttendanceValue | null) => void;
	readonly className?: string;
};

export function AttendanceChip(props: AttendanceChipProps) {
	const {
		attendance,
		group,
		serverTz,
		useCurrentTime = false,
		onAttendanceChange,
		date,
		className,
	} = props;

	const currentDateTime = now(serverTz);

	const selectHandler = (select: Key) => {
		if (select === 'absence') {
			onAttendanceChange(null);
			return;
		}

		onAttendanceChange({
			date,
			time: useCurrentTime ? toTime(now(serverTz)) : null,
			type: select as AttendanceType,
		});
	};

	const selection = attendance === null ? 'absence' : attendance.type;

	return (
		<Select aria-label='Estado de asistencia' selectedKey={selection} className={className} isDisabled={toCalendarDate(currentDateTime) < date || !group[`enabled${daysOfTheWeek[getDayOfWeek(date, 'en-US')]}`]} onSelectionChange={selectHandler}>
			<Item key='absence' textValue='Pendiente'>
				{
					currentDateTime < toZoned(toCalendarDateTime(date, group.entryTime), serverTz)
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

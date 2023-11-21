import React, {useState} from 'react';
import {type Attendance, AttendanceType, type Group, type Student} from '@prisma/client';
import {fromDate, getLocalTimeZone, now, type Time, toCalendarDateTime, today, toZoned} from '@internationalized/date';
import {Item, type Key} from 'react-stately';
import {type Serializable} from '@/lib/serializable.ts';
import Select from '@/components/select.tsx';

export type AttendanceChipProps = {
	readonly studentId: number;
	readonly groupId: number;
	readonly entryHour: Date;
	readonly groupTz: string;
	readonly attendance: Attendance | null;
	readonly onAttendanceChange: (attendance: Attendance | null) => void;
};

export function AttendanceChip(props: AttendanceChipProps) {
	const {
		studentId,
		groupId,
		entryHour,
		groupTz,
		attendance,
		onAttendanceChange,
	} = props;

	const localTz = getLocalTimeZone();

	const currentDate = today(localTz);
	const entryDateTime = toZoned(toCalendarDateTime(today(groupTz), fromDate(entryHour, groupTz)), groupTz);
	const currentDateTime = now(localTz);

	const selectHandler = (select: Key) => {
		if (select === 'absence') {
			onAttendanceChange(null);
			return;
		}

		onAttendanceChange({
			attendanceDate: currentDate.toDate(groupTz),
			attendanceEntryHour: now(groupTz).toDate(),
			attendanceExitHour: now(groupTz).toDate(),
			type: select as AttendanceType,
			groupId,
			studentId,
		});
	};

	const selection = attendance === null ? 'absence' : attendance.type;

	return (
		<Select aria-label='Estado de asistencia' selectedKey={selection} onSelectionChange={selectHandler}>
			<Item key='absence' textValue='Pendiente'>
				{
					currentDateTime < entryDateTime
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
					Confirmado
				</div>

			</Item>
		</Select>
	);
}

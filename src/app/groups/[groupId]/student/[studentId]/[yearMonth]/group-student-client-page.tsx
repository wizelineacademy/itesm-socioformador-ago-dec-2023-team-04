'use client';
import React, {useMemo} from 'react';
import {
	CalendarDate, DateFormatter, fromDate,
	getWeeksInMonth, isSameMonth, isWeekend,
	startOfWeek, today, toTime,
} from '@internationalized/date';
import {useListData} from 'react-stately';
import {type StudentWithGroupAttendances} from '@/lib/students.ts';
import TopBarPageTemplate from '@/components/top-bar-page-template.tsx';
import Icon from '@/components/icon.tsx';
import LinkButton from '@/components/link-button.tsx';
import {cx} from '@/lib/cva.ts';
import {AttendanceChip, type AttendanceValue} from '@/components/attendance-chip.tsx';
import {Button} from '@/components/button.tsx';
import updateStudentAttendancesAction
	from '@/app/groups/[groupId]/student/[studentId]/[yearMonth]/update-student-attendances-action.ts';

const dayNames = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá'];

export type GroupStudentClientPageProps = {
	readonly student: StudentWithGroupAttendances;
	readonly year: number;
	readonly month: number;
	readonly serverTz: string;
	readonly title: string;
	readonly subtitle: string;
};

export default function GroupStudentClientPage(props: GroupStudentClientPageProps) {
	const {
		student,
		year,
		month,
		title,
		subtitle,
		serverTz,
	} = props;
	const firstDayOfMonth = new CalendarDate(year, month, 1);
	const weeks = getWeeksInMonth(firstDayOfMonth, 'en-US');
	const calendarStart = startOfWeek(new CalendarDate(year, month, 1), 'en-US');

	const studentGroup = student.groups[0].group;

	const group = {
		...studentGroup,
		id: studentGroup.id,
		entryTime: toTime(fromDate(studentGroup.entryHour, studentGroup.tz)),
		tz: studentGroup.tz,
	};

	const initialAttendances = useMemo<AttendanceValue[]>(() => studentGroup.attendances.map(attendance => ({
		date: new CalendarDate(attendance.attendanceDate.getUTCFullYear(), attendance.attendanceDate.getUTCMonth() + 1, attendance.attendanceDate.getUTCDate()),
		time: attendance.attendanceEntryHour ? toTime(fromDate(new Date(attendance.attendanceEntryHour), serverTz)) : null,
		type: attendance.type,
	})), [serverTz, studentGroup.attendances]);

	const attendances = useListData({
		initialItems: initialAttendances,
		getKey(item) {
			return item.date.toString();
		},
	});

	const days = useMemo(() => {
		const days: CalendarDate[] = [];

		for (let day = 0; day < weeks * 7; day++) {
			const date = calendarStart.add({
				days: day,
			});

			days.push(date);
		}

		return days;
	}, [calendarStart, weeks]);

	const previousMonth = firstDayOfMonth.subtract({
		months: 1,
	});
	const nextMonth = firstDayOfMonth.add({
		months: 1,
	});

	const currentDate = today(serverTz);

	return (
		<TopBarPageTemplate
			title={title}
			subtitle={subtitle}
			topBarItems={(
				<>
					<span className='grow'/>
					<LinkButton href={`/groups/${group.id}/student/${student.id}/${previousMonth.year}-${previousMonth.month}`} color='secondary'>
						<Icon name='arrow_left'/>
					</LinkButton>
					<LinkButton href={`/groups/${group.id}/student/${student.id}/${nextMonth.year}-${nextMonth.month}`} color='secondary' isDisabled={currentDate < nextMonth}>
						<Icon name='arrow_right'/>
					</LinkButton>
					<Button
						color='secondary' onPress={async () => {
							await updateStudentAttendancesAction(student.id, group.id, attendances.items.map(item => ({
								attendanceDate: item.date.toDate(serverTz),
								type: item.type,
							})));
						}}
					>
						<Icon name='save' className='me-1'/>
						Guardar
					</Button>
				</>
			)}
		>
			<div className='grid grid-cols-7 bg-stone-800 rounded'>
				{
					dayNames.map(name => (
						<div key={name} className='text-stone-400 border-b border-stone-700 py-2 px-4'>
							{name}
						</div>
					))
				}
				{
					days.map(day => (
						<div
							key={day.toString()} className={cx(
								'p-4 font-semibold text-3xl border border-transparent focus-within:border-stone-700 hover:border-stone-700 rounded',
								day.month === month && 'text-stone-300',
								day.month !== month && 'text-stone-500',
								isWeekend(day, 'en-US') && 'text-wBlue-300',
							)}
						>
							<div className='mb-4'>
								{day.day}
							</div>
							{
								isSameMonth(day, firstDayOfMonth) && (
									<AttendanceChip
										date={day}
										serverTz={serverTz}
										group={group}
										attendance={attendances.getItem(day.toString()) ?? null} onAttendanceChange={attendance => {
											if (attendance === null) {
												console.log('removing');
												attendances.remove(day.toString());
											} else if (attendances.getItem(day.toString())) {
												console.log('updating');
												attendances.update(day.toString(), attendance);
											} else {
												console.log('appending');
												attendances.append(attendance);
											}
										}}/>
								)
							}
						</div>
					))
				}
			</div>
		</TopBarPageTemplate>
	);
}

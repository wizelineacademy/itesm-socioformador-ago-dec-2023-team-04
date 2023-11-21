'use client';

import React, {useMemo} from 'react';
import {createColumnHelper} from '@tanstack/table-core';
import {getLocalTimeZone, parseDate, today} from '@internationalized/date';
import {useListData} from 'react-stately';
import {type Attendance} from '@prisma/client';
import {type Serializable} from '@/lib/serializable.ts';
import {type GroupWithStudentsAttendance} from '@/lib/group.ts';
import FormattedDate from '@/app/groups/[groupId]/[date]/formatted-date.tsx';
import TopBarPageTemplate from '@/components/top-bar-page-template.tsx';
import {AttendanceChip} from '@/components/attendance-chip.tsx';
import Table from '@/components/table.tsx';
import LinkButton from '@/components/link-button.tsx';
import Icon from '@/components/icon.tsx';
import {getGroupClassDate} from '@/app/groups/class-dates.ts';

export type AttendanceClientPageProps = {
	readonly group: Serializable<GroupWithStudentsAttendance>;
	readonly date: string;
	readonly className?: string;
};

type StudentWithCurrentAttendance = {
	id: number;
	givenName: string;
	familyName: string;
	attendance: Attendance | null;
};

const columnHelper = createColumnHelper<StudentWithCurrentAttendance>();

export default function AttendanceClientPage(props: AttendanceClientPageProps) {
	const {
		group,
		date,
		className,
	} = props;

	const parsedDate = parseDate(date);

	const previousDate = getGroupClassDate(group, -1, parsedDate);
	const nextDate = getGroupClassDate(group, 1, parsedDate);
	const firstDate = getGroupClassDate(group, 0);

	const localTz = getLocalTimeZone();

	const attendances = useListData<StudentWithCurrentAttendance>({
		initialItems: group.students.map(student => {
			const {attendances} = student.student;

			return {
				id: student.studentId,
				givenName: student.student.givenName,
				familyName: student.student.familyName,
				attendance: attendances.length === 0 ? null : {
					...attendances[0],
					attendanceDate: new Date(attendances[0].attendanceDate),
					attendanceEntryHour: new Date(attendances[0].attendanceEntryHour),
					attendanceExitHour: new Date(attendances[0].attendanceExitHour),
				},
			};
		}),
	});

	const columns = useMemo(() => [
		columnHelper.accessor(item => `${item.givenName} ${item.familyName}`, {
			id: 'student',
			header: 'Alumno',
			cell: props => (
				props.cell.renderValue()
			),
		}),
		columnHelper.accessor(item => {
			if (item.attendance) {
				return {
					...item.attendance,
					attendanceDate: new Date(item.attendance.attendanceDate),
					attendanceEntryHour: new Date(item.attendance.attendanceEntryHour),
					attendanceExitHour: new Date(item.attendance.attendanceExitHour),
				};
			}

			return null;
		}, {
			header: 'Asistencia',
			// Don't mind the warning, the columns are memoized and as such this cell component is stable.
			cell: props => (
				<AttendanceChip
					studentId={props.row.original.id}
					groupId={group.id}
					groupTz={group.tz}
					entryHour={(new Date(group.entryHour))}
					attendance={props.cell.getValue()}
					onAttendanceChange={attendance => {
						console.log(attendance);
						attendances.update(props.row.original.id, {
							...props.row.original,
							attendance,
						});
					}}/>
			),
		}),
	], [attendances, group.entryHour, group.id, group.tz]);

	return (
		<TopBarPageTemplate
			title={group.name} subtitle={<FormattedDate date={date} tz={group.tz}/>} topBarItems={
				<>
					<LinkButton href={`/groups/${group.id}/${firstDate?.toString()}`} color='secondary' variant='outlined'>
						<Icon name='home'/>
					</LinkButton>
					<LinkButton href={`/groups/${group.id}/${previousDate?.toString()}`} color='secondary'>
						<Icon name='arrow_left'/>
					</LinkButton>
					<LinkButton href={`/groups/${group.id}/${nextDate?.toString()}`} color='secondary' isDisabled={nextDate && today(localTz) < nextDate}>
						<Icon name='arrow_right'/>
					</LinkButton>
					<LinkButton href={`/groups/edit/${group.id}`} color='secondary'>
						<Icon name='edit'/>
					</LinkButton>
				</>
			}
		>
			<Table
				data={attendances.items} columns={columns}
			/>
		</TopBarPageTemplate>
	);
}

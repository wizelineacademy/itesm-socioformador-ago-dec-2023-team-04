'use client';

import React, {useMemo} from 'react';
import {createColumnHelper} from '@tanstack/table-core';
import {
	fromDate,
	getLocalTimeZone,
	parseDate,
	toCalendarDate,
	toCalendarDateTime,
	today,
	toTime,
} from '@internationalized/date';
import {useListData} from 'react-stately';
import {type User} from '@prisma/client';
import {type Serializable} from '@/lib/serializable.ts';
import {type GroupWithStudentsAttendance} from '@/lib/groups.ts';
import FormattedDate from '@/app/groups/[groupId]/[date]/formatted-date.tsx';
import TopBarPageTemplate from '@/components/top-bar-page-template.tsx';
import {AttendanceChip, type AttendanceValue} from '@/components/attendance-chip.tsx';
import Table from '@/components/table.tsx';
import LinkButton from '@/components/link-button.tsx';
import Icon from '@/components/icon.tsx';
import {getGroupClassDate} from '@/app/groups/class-dates.ts';
import {Button} from '@/components/button.tsx';
import submitAttendancesAction from '@/app/groups/[groupId]/[date]/submit-attendances-action.ts';

export type AttendanceClientPageProps = {
	readonly group: Serializable<GroupWithStudentsAttendance>;
	readonly date: string;
	readonly user: User;
	readonly serverTz: string;
};

const columnHelper = createColumnHelper<{
	id: number;
	givenName: string;
	familyName: string;
	attendance: AttendanceValue | null;
}>();

export default function AttendanceClientPage(props: AttendanceClientPageProps) {
	const {
		group,
		date,
		user,
		serverTz,
	} = props;

	const parsedDate = useMemo(() => parseDate(date), [date]);

	const previousDate = getGroupClassDate(group, -1, parsedDate);
	const nextDate = getGroupClassDate(group, 1, parsedDate);
	const firstDate = getGroupClassDate(group, 0);

	const localTz = getLocalTimeZone();

	const entryHour = toTime(fromDate(new Date(group.entryHour), group.tz));

	const initialAttendances = useMemo(() => group.students.map(student => {
		const {attendances} = student.student;

		const attendance = attendances.length === 0 ? null : attendances[0];

		return {
			id: student.studentId,
			givenName: student.student.givenName,
			familyName: student.student.familyName,
			attendance: attendance ? {
				date: toCalendarDate(fromDate(new Date(attendance.attendanceDate), group.tz)),
				time: attendance.attendanceEntryHour ? toTime(fromDate(new Date(attendance.attendanceEntryHour), group.tz)) : null,
				type: attendance.type,
			} : null,
		};
	}), [group.students, group.tz]);

	const attendances = useListData({
		initialItems: initialAttendances,
	});

	const columns = useMemo(() => [
		columnHelper.accessor('givenName', {
			header: 'Nombre(s)',
			cell: props => (
				props.cell.renderValue()
			),
		}),
		columnHelper.accessor('familyName', {
			header: 'Apellido(s)',
			cell: props => (
				props.cell.renderValue()
			),
		}),
		columnHelper.accessor('attendance', {
			header: 'Asistencia',
			// Don't mind the warning, the columns and its dependencies are stable and as such this cell component is stable.
			cell: props => (
				<AttendanceChip
					className='w-36' date={parsedDate} group={{
						...group,
						entryTime: entryHour,
					}}
					serverTz={serverTz} attendance={props.cell.getValue()} onAttendanceChange={attendance => {
						attendances.update(props.row.original.id, {
							...props.row.original,
							attendance,
						});
					}}/>
			),
		}),
	], [attendances, entryHour, group, parsedDate, serverTz]);

	return (
		<TopBarPageTemplate
			title={group.name} subtitle={<FormattedDate date={date} tz={group.tz}/>} topBarItems={
				<>
					{user.admin
						? <LinkButton href={`/groups/edit/${group.id}`} color='tertiary' variant='outlined'>
							<Icon name='edit'/>
						</LinkButton> : null}
					<LinkButton href={`/groups/${group.id}/${firstDate?.toString()}`} color='secondary' variant='outlined'>
						<Icon name='home'/>
					</LinkButton>
					<LinkButton href={`/groups/${group.id}/${previousDate?.toString()}`} color='secondary'>
						<Icon name='arrow_left'/>
					</LinkButton>
					<LinkButton href={`/groups/${group.id}/${nextDate?.toString()}`} color='secondary' isDisabled={nextDate && today(localTz) < nextDate}>
						<Icon name='arrow_right'/>
					</LinkButton>
					<Button
						color='secondary' onPress={() => {
							void submitAttendancesAction(attendances.items.map(attendance => ({
								id: attendance.id,
								givenName: attendance.givenName,
								familyName: attendance.familyName,
								attendance: attendance.attendance ? {
									attendanceDate: attendance.attendance.date.toDate(group.tz),
									attendanceEntryHour: attendance.attendance.time ? toCalendarDateTime(attendance.attendance.date, attendance.attendance.time).toDate(group.tz) : null,
									attendanceExitHour: null,
									groupId: group.id,
									studentId: attendance.id,
									type: attendance.attendance.type,
								} : null,
							})), date, group.id);
						}}
					>
						<Icon name='save' className='me-1'/>
						Guardar
					</Button>

				</>
			}
		>
			<div className='bg-stone-800 rounded'>
				<Table
					colClassNames={[
						'',
						'',
						'w-0',
						'w-12',
					]}
					getDetailsLink={({id}) => `/groups/${group.id}/student/${id}`}
					data={attendances.items} columns={columns}
				/>
			</div>

		</TopBarPageTemplate>
	);
}

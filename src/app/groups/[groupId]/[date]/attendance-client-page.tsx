'use client';

import React, {useMemo} from 'react';
import {createColumnHelper} from '@tanstack/table-core';
import {CalendarDate, getLocalTimeZone, parseDate, today} from '@internationalized/date';
import {useListData} from 'react-stately';
import {type Serializable} from '@/lib/serializable.ts';
import {type GroupWithStudentsAttendance} from '@/lib/group.ts';
import FormattedDate from '@/app/groups/[groupId]/[date]/formatted-date.tsx';
import TopBarPageTemplate from '@/components/top-bar-page-template.tsx';
import {AttendanceChip} from '@/components/attendance-chip.tsx';
import Table from '@/components/table.tsx';
import LinkButton from '@/components/link-button.tsx';
import Icon from '@/components/icon.tsx';
import {getGroupClassDate} from '@/app/groups/class-dates.ts';
import {Button} from '@/components/button.tsx';
import {type User} from '@prisma/client';
import prisma from '@/lib/prisma.ts';
import submitAttendancesAction, {type StudentWithCurrentAttendance} from '@/app/groups/[groupId]/[date]/submit-attendances-action.ts';

export type AttendanceClientPageProps = {
	readonly group: Serializable<GroupWithStudentsAttendance>;
	readonly date: string;
	readonly className?: string;
	readonly user: User;
};

const columnHelper = createColumnHelper<StudentWithCurrentAttendance>();

export default function AttendanceClientPage(props: AttendanceClientPageProps) {
	const {
		group,
		date,
		className,
		user,
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
		columnHelper.accessor(item => {
			if (item.attendance) {
				return {
					...item.attendance,
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
					className='w-36'
					studentId={props.row.original.id}
					groupId={group.id}
					groupTz={group.tz}
					date={parsedDate}
					entryHour={(new Date(group.entryHour))}
					attendance={props.cell.getValue()}
					onAttendanceChange={attendance => {
						attendances.update(props.row.original.id, {
							...props.row.original,
							attendance,
						});
					}}/>
			),
		}),
	], [attendances, group.entryHour, group.id, group.tz, parsedDate]);

	return (
		<TopBarPageTemplate
			title={group.name} subtitle={<FormattedDate date={date} tz={group.tz}/>} topBarItems={
				<>
					{user.admin
						?<LinkButton href={`/groups/edit/${group.id}`} color='tertiary' variant='outlined'>
							<Icon name='edit'/>
						</LinkButton>:null
					}
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
							void submitAttendancesAction(attendances.items, date, group.id);
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
					]}
					data={attendances.items} columns={columns}
				/>
			</div>

		</TopBarPageTemplate>
	);
}

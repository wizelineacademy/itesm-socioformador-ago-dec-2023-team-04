import React from 'react';
import StatisticsClient from '@/app/statistics/statistics-client.tsx';
import {getUserFromSession, getGroupsWithUserId} from '@/lib/user.ts';
import StatisticsServer from "@/app/statistics/statistics-server.tsx";
import {AttendanceType} from "@prisma/client";
import {attendanceAbsence, attendanceJustificatedAbsence, attendanceLate, attendanceOnTime} from "@/lib/attendance.ts";
import StatisticsBarChart from "@/app/statistics/statistics-bar-chart.tsx";

function formatDataForChart(data: Array<{ attendanceDate: Date; _count: { type: number } }>) {
	return data.map(entry => ({
		date: entry.attendanceDate,
		count: entry._count.type,
	}));
}

export default async function Page() {
	const userId = await getUserFromSession();

	if (userId === null) {
		throw new Error('User not found');
	}

	const groupList = await getGroupsWithUserId(userId.id);

	if (groupList === null) {
		throw new Error('Groups not found');
	}

	const info: string = 'ON_TIME';
	const groupId: number = 1;
	const dateRange: Date[] = [new Date('0000-00-00')];

	let data: any[] = [];
	switch (info) {
		case AttendanceType.ON_TIME: {
			data = formatDataForChart(await attendanceOnTime(groupId, dateRange));
			break;
		}

		case AttendanceType.LATE: {
			data = formatDataForChart(await attendanceLate(groupId, dateRange));
			break;
		}

		case 'absence': {
			data = formatDataForChart(await attendanceAbsence(groupId, dateRange));
			break;
		}

		case AttendanceType.JUSTIFICATED_ABSENCE: {
			data = formatDataForChart(await attendanceJustificatedAbsence(groupId, dateRange));
			break;
		}

		default: {
			break;
		}
	}

	return (
		<main className='flex flex-col h-full text-stone-400'>
			<div className='flex items-top mb-4 gap-4'>
				<h1 className='text-4xl text-stone-50'>
					Estadísticas
				</h1>

			</div>
			<div>
				<div>
					<StatisticsClient groups={groupList.groups}/>
				</div>
				<h2> Gráfico </h2>
				<StatisticsBarChart data={data}/>
			</div>
		</main>
	);
}

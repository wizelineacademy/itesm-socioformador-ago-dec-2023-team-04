import React from 'react';
import {Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis} from 'recharts';
import {AttendanceType} from '@prisma/client';
import {attendanceAbsence, attendanceJustificatedAbsence, attendanceLate, attendanceOnTime} from '@/lib/attendance.ts';

function formatDataForChart(data: Array<{attendanceDate: Date; _count: {type: number}}>) {
	return data.map(entry => ({
		date: entry.attendanceDate,
		count: entry._count.type,
	}));
}

export default async function Chart({info, groupId, dateRange}: {
	readonly info: string;
	readonly groupId: number;
	readonly dateRange: Date[];
}) {
	let data: any[] = [
		{
			date: new Date('2023-11,26'),
			count: 1,
		},
		{
			date: new Date('2023-11,27'),
			count: 0,
		},
	];
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
		<ResponsiveContainer width='100%' height='100%'>
			<BarChart
				width={500}
				height={300}
				data={data}
				margin={{
					top: 20,
					right: 30,
					left: 20,
					bottom: 5,
				}}
			>
				<CartesianGrid strokeDasharray='3 3'/>
				<XAxis dataKey='date'/>
				<YAxis/>
				<Tooltip/>
				<Legend/>
				<Bar dataKey='_count' stackId='a' fill='#8884d8'/>
			</BarChart>
		</ResponsiveContainer>
	);
}

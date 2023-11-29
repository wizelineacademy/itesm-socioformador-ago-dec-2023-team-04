import React from 'react';
import {AttendanceType} from '@prisma/client';
import Icon from '@/components/icon.tsx';
import StatisticsStraightAnglePieChart from '@/app/statistics/statistics-straight-angle-pie-chart.tsx';
import {
	getLastMonthAttendanceJustificatedAbsence,
	getLastMonthAttendanceLate,
	getLastMonthAttendanceOnTime
} from "@/lib/attendance.ts";

type StatisticsCardProps = {
	readonly id: number;
	readonly name: string;
	readonly studentCount: number;
	readonly color: string;
};

export default async function GroupStatisticsCard(props: StatisticsCardProps) {
	const {id, name, studentCount, color} = props;

	const lastMonthOnTime = await getLastMonthAttendanceOnTime(id);
	const lastMonthLate = await getLastMonthAttendanceLate(id);
	const lastMonthJustifiedAbsence = await getLastMonthAttendanceJustificatedAbsence(id);
	const lastMonthAbsence = (studentCount * 30) - lastMonthOnTime - lastMonthLate - lastMonthJustifiedAbsence;
	const averageAttendance = (lastMonthOnTime + lastMonthAbsence) / (studentCount * 30);

	const data = [
		{
			type: 'ONTIME', value: lastMonthOnTime,
		},
		{
			type: 'LATE', value: lastMonthLate,
		},
		{
			type: 'JUSTIFICATED_ABSENCE', value: lastMonthJustifiedAbsence,
		},
		{type: 'ABSENCE', value: lastMonthAbsence},
	];

	return (
		<div
			className='border border-stone-700 rounded bg-stone-800 w-64 flex flex-col'
		>
			<div
				className='rounded-t pt-6 px-2 grow flex flex-col justify-end'
				style={{backgroundColor: `#${color}`}}
			>
				<h2 className='flex items-end text-stone-800 text-4xl font-bold'>
					{name}
				</h2>
			</div>
			<div className='flex p-2'>
				<Icon name='person' className='me-1'/>
				{studentCount} estudiante{studentCount === 1 ? '' : 's'}
			</div>
			<div className='p-2'>Promedio de asistencia: {averageAttendance}</div>
			<div className='p-2'>
				Gráfica de asistencia del último mes
				<StatisticsStraightAnglePieChart data={data}/>
			</div>
		</div>
	);
}

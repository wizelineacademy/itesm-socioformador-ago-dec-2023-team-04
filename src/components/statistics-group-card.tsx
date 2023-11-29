import React from 'react';
import Icon from '@/components/icon.tsx';
import {
	getLastMonthAttendanceOnTime,
	getLastMonthAttendanceLate,
	getLastMonthAttendanceJustificatedAbsence,
} from '@/lib/attendance.ts';
import StatisticsStraightAnglePieChart from '@/components/statistics-straight-angle-pie-chart.tsx';

type StatisticsGroupCardProps = {
	readonly id: number;
	readonly studentCount: number;
	readonly name: string;
	readonly color: string;
};

export default async function StatisticsGroupCard(props: StatisticsGroupCardProps) {
	const {studentCount, name, color, id} = props;
	const lastMonthOnTime = await getLastMonthAttendanceOnTime(id);
	const lastMonthLate = await getLastMonthAttendanceLate(id);
	const lastMonthJustificatedAbsence = await getLastMonthAttendanceJustificatedAbsence(id);
	const lastMonthAbsence = (studentCount * 30) - lastMonthJustificatedAbsence - lastMonthLate - lastMonthOnTime;
	const data = [
		{type: 'ON_TIME', value: lastMonthOnTime},
		{type: 'LATE', value: lastMonthLate},
		{type: 'JUSTIFICATED_ABSENCE', value: lastMonthJustificatedAbsence},
		{type: 'ABSENCE', value: lastMonthAbsence},
	];
	const averageAttendance = (lastMonthOnTime + lastMonthLate) / (studentCount * 30);

	return (
		<div className='border border-stone-700 rounded bg-stone-800 w-64 flex flex-col'>
			<div
				className='rounded-t pt-6 px-2 grow flex flex-col justify-end'
				style={{
					backgroundColor: `#${color}`,
				}}
			>
				<h2 className='flex items-end text-stone-800 text-4xl font-bold'>
					{name}
				</h2>
			</div>
			<div className='flex p-2'>
				<Icon name='person' className='me-1'/>
				{studentCount} estudiante{studentCount === 1 ? '' : 's'}
			</div>
			<div className='p-2'>
				Promedio de asistencia: {averageAttendance}
			</div>
			<div className='p-2'>
				Gráfica de asistencia en el último mes
				<StatisticsStraightAnglePieChart data={data}/>
			</div>
		</div>
	);
}

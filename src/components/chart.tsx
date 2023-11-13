import React from 'react';
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from 'recharts';

export type ChartProps = {
	readonly data?: AttendanceData[];
};
export type AttendanceData = {
	date?: string;
	entryCount?: number;
	exitCount?: number;
	hours?: string;
};
export default function Chart(props: ChartProps) {
	const {data} = props;
	return (
		<BarChart
			width={1000}
			height={300}
			data={data}
			margin={{
				top: 20,
				right: 30,
				left: 20,
				bottom: 5,
			}}
		><CartesianGrid strokeDasharray='3 3'/>
			<XAxis dataKey='date'/>
			<YAxis/>
			<Tooltip/>
			<Legend/>
			<Bar name='Asistencias' dataKey='att' stackId='a' fill='#324c67'/>
			<Bar name='Faltas' dataKey='abs' stackId='a' fill='#e93d44'/></BarChart>
	);
}

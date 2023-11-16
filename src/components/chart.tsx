import React from 'react';
import {BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from 'recharts';

export default function Chart() {
	const data = [
		{
			date: '11/11/2023',
			att: 15,
			abs: 5,
		},
		{
			date: '12/11/2023',
			att: 19,
			abs: 1,
		},
		{
			date: '13/11/2023',
			att: 20,
			abs: 0,
		},
		{
			date: '14/11/2023',
			att: 13,
			abs: 7,
		},
		{
			date: '15/11/2023',
			att: 18,
			abs: 2,
		},
		{
			date: '16/11/2023',
			att: 18,
			abs: 2,
		},
	];
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
				<Bar dataKey='att' stackId='a' fill='#8884d8'/>
				<Bar dataKey='abs' stackId='a' fill='#82ca9d'/>
			</BarChart>
		</ResponsiveContainer>
	);
}
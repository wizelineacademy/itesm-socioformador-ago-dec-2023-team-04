'use client';
import React from 'react';
import {Bar, BarChart, CartesianGrid, Legend, Tooltip, XAxis, YAxis} from 'recharts';

export default function StatisticsBarChart({data}: {readonly data: any[]}) {
	return (
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
	);
}

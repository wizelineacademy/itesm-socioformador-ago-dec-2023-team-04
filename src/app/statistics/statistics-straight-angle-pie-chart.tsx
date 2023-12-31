'use client';
import React from 'react';
import {PieChart, Pie, Cell} from 'recharts';

const colors = ['#4ade80', '#fbbf24', '#f871c0', '#f87171'];

const radian = Math.PI / 180;
const renderCustomizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent, index}: {cx: number; cy: number; midAngle: number; innerRadius: number; outerRadius: number; percent: number; index: number}) => {
	const radius = innerRadius + ((outerRadius - innerRadius) * 0.5);
	const x = cx + (radius * Math.cos(-midAngle * radian));
	const y = cy + (radius * Math.sin(-midAngle * radian));

	return (
		<text x={x} y={y} fill='white' textAnchor={x > cx ? 'start' : 'end'} dominantBaseline='central'>
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	);
};

export default function StatisticsStraightAnglePieChart({data}: {readonly data: any[]}) {
	return (
		<PieChart width={237} height={100}>
			<Pie
				dataKey='value'
				startAngle={180}
				endAngle={0}
				data={data}
				cy='100%'
				outerRadius={80}
				labelLine={false}
				label={renderCustomizedLabel}
			>
				{data.map((entry, index) => (
					// eslint-disable-next-line react/no-array-index-key
					<Cell key={index} fill={colors[index % colors.length]}/>
				))}
			</Pie>
		</PieChart>
	);
}

'use client';
import React from 'react';
import {PieChart, Pie, Cell} from 'recharts';

const colors = ['#4ade80', '#fbbf24', '#f87171'];

const radian = Math.PI / 180;
const renderCustomizedLabel = ({cx, cy, midAngle, innerRadius, outerRadius, percent, index}: {
	cx: number;
	cy: number;
	midAngle: number;
	innerRadius: number;
	outerRadius: number;
	percent: number;
	index: number
}) => {
	const radius = innerRadius + ((outerRadius - innerRadius) * 0.5);
	const x = cx + (radius * Math.cos(-midAngle * radian));
	const y = cy + (radius * Math.sin(-midAngle * radian));

	return (
		<text x={x} y={y} fill='#292524' textAnchor={x > cx ? 'start' : 'end'} dominantBaseline='central'>
			{`${(percent * 100).toFixed(0)}%`}
		</text>
	);
};

export default function StatisticsPieChart({data}: { readonly data: any[] }) {
	return (
		<PieChart width={232} height={168}>
			<Pie
				dataKey='value'
				data={data}
				cy='50%'
				cx='50%'
				outerRadius={80}
				labelLine={false}
				label={renderCustomizedLabel}
				stroke='#292524'
			>
				{data.map((entry, index) => (
					// eslint-disable-next-line react/no-array-index-key
					<Cell key={`cell-${index}`} fill={colors[index % colors.length]}/>
				))}
			</Pie>
		</PieChart>
	);
}

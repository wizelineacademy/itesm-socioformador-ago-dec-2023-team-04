'use client';
import React from 'react';
import {type DateValue} from '@internationalized/date';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from 'recharts';
import {Input} from '@/components/input.tsx';
import {RadioGroup, Radio} from '@/components/radio.tsx';
import {DateRangePicker} from '@/components/date-range-picker.tsx';
import {dateSchema} from '@/lib/statistics.ts';
import Select from '@/components/select.tsx';
import Chart from '@/components/chart.tsx';

export default function Home() {
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
		<main className='flex flex-col h-full text-stone-400'>
			<div className='flex items-top mb-4 gap-4'>
				<h1 className='text-4xl text-stone-50'>
					Estadísticas
				</h1>
			</div>
			<div className='flex flex-col gap-4 h-full p-4'>
				<div className='bg-stone-800 grow rounded'>
					<RadioGroup label='Seleccione uno'>
						<Radio value='entry'>Registro de entradas</Radio>
						<Radio value='exit'>Registro de salidas</Radio>
						<Radio value='attendence'>Registro de asistencias</Radio>
						<Radio value='entryHours'>Horas de entrada</Radio>
						<Radio value='exitHours'>Horas de salida</Radio>
					</RadioGroup>
					<DateRangePicker
						label='Seleccione un intérvalo de fechas'/>

					<h2> Gráfico </h2>
					<Chart/>
				</div>
			</div>
		</main>
	);
}

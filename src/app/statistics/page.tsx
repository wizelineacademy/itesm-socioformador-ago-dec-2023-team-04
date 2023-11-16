'use client';
import React from 'react';
import {type DateValue} from '@internationalized/date';
import {RadioGroup, Radio} from '@/components/radio.tsx';
import DateRangePicker from '@/components/date-range-picker.tsx';
import {dateSchema} from '@/lib/statistics.ts';
import Chart from '@/components/chart.tsx';

export default function Home() {
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

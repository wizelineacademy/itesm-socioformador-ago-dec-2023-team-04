'use client';
import React from 'react';
import {Input} from '@/components/input.tsx';
import {RadioGroup, Radio} from '@/components/radio.tsx';
import {DatePicker} from '@/components/date-picker.tsx';

export default function Home() {
	return (
		<main className='flex flex-col h-full text-stone-400'>
			<div className='flex items-top mb-4 gap-4'>
				<h1 className='text-4xl text-stone-50'>
					Estadísticas
				</h1>
			</div>
			<div className='flex flex-col gap-4 h-full'>
				<div className='bg-stone-800 grow rounded'>
					<RadioGroup label='Seleccione uno'>
						<Radio value='entry'>Registro de entradas</Radio>
						<Radio value='exit'>Registro de salidas</Radio>
					</RadioGroup>
					Tiempo <Input className='w-1/4'/>
					<DatePicker/>
					Grupo(s): <Input type='text' className='w-1/2' placeholder='Grupos...'/>
					<div>Gráfica</div>
				</div>
			</div>
		</main>
	);
}

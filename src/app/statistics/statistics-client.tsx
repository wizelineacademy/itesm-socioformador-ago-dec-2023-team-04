'use client';
import React, {useState} from 'react';
import {getLocalTimeZone, today} from '@internationalized/date';
import {AttendanceType} from '@prisma/client';
import {Item} from 'react-stately';
import {type DateRange} from 'react-aria';
import {RadioGroup, Radio} from '@/components/radio.tsx';
import DateRangePicker from '@/components/date-range-picker.tsx';
import Select from '@/components/select.tsx';
import Chart from '@/app/statistics/chart.tsx';

export type Groups = {
	readonly id: number;
	readonly name: string;
};

export default function StatisticsClient({groups}: {readonly groups: Groups[]}) {
	const [groupId, setGroupId] = useState(0);
	const [graphTypeInfo, setGraphTypeInfo] = useState('');

	const [selectedDates, setSelectedDates] = useState<DateRange | null>(null);
	const [dateRange, setDateRange] = useState<Date[]>([]);
	const handleGetDateRangeAsStrings = (value: DateRange | null) => {
		setSelectedDates(value);
		if (selectedDates) {
			const startDateString = selectedDates.start.toDate(getLocalTimeZone());
			const endDateString = selectedDates.end.toDate(getLocalTimeZone());
			const dateRangeAsStrings: Date[] = [];
			const currentDate = new Date(startDateString);

			// eslint-disable-next-line no-unmodified-loop-condition
			while (currentDate <= endDateString) {
				dateRangeAsStrings.push(currentDate);
				currentDate.setDate(currentDate.getDate() + 1);
			}

			setDateRange(dateRangeAsStrings);
		}
	};

	return (
		<div className='flex flex-col gap-4 h-full p-4'>
			<div className='bg-stone-800 grow rounded'>
				<Select
					label='Seleccione un grupo'
					items={groups} selectedKey={groupId}
					onSelectionChange={key => {
						setGroupId(key as number);
					}}
				>
					{
						item => (
							<Item key={item.id}>
								{item.name}
							</Item>
						)
					}
				</Select>
				<RadioGroup
					label='Seleccione uno'
					name='graph type'
					onChange={value => {
						setGraphTypeInfo(value);
					}}
				>
					<Radio value={AttendanceType.ON_TIME}>Registro de asistencias</Radio>
					<Radio value={AttendanceType.LATE}>Registro de retrasos</Radio>
					<Radio value='absence'>Registro de faltas</Radio>
					<Radio value={AttendanceType.JUSTIFICATED_ABSENCE}>Registro de faltas justificadas</Radio>
					<Radio value='entryHours'>Horas de registros</Radio>
				</RadioGroup>
				<DateRangePicker
					label='Seleccione un intérvalo de fechas'
					maxValue={today(getLocalTimeZone())}
					value={selectedDates}
					onChange={value => {
						handleGetDateRangeAsStrings(value);
					}}/>
			</div>
			<h2> Gráfico </h2>
			<Chart info={graphTypeInfo} groupId={groupId} dateRange={dateRange}/>
		</div>
	);
}

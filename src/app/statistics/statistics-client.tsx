'use client';
import React, {useState} from 'react';
import {getLocalTimeZone, today} from '@internationalized/date';
import {AttendanceType} from '@prisma/client';
import {Item} from 'react-stately';
import {type DateRange} from 'react-aria';
import {RadioGroup, Radio} from '@/components/radio.tsx';
import DateRangePicker from '@/components/date-range-picker.tsx';
import Select from '@/components/select.tsx';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import StatisticsBarChart from '@/app/statistics/statistics-bar-chart.tsx';


export type Groups = {
	readonly id: number;
	readonly name: string;
};

export default function StatisticsClient({groups, userId}: {readonly groups: Groups[]: userId: number}) {
	const [groupId, setGroupId] = useState(0);
	const [graphTypeInfo, setGraphTypeInfo] = useState('');

	const [selectedDates, setSelectedDates] = useState<DateRange | null>(null);
	const [dateRange, setDateRange] = useState<Date[]>([]);
	const [initialDate, setInitialDate] = useState();
	const [endDate, setEndDate] = useState();
	const handleGetDateRange = (value: DateRange | null) => {
		setSelectedDates(value);
		if (selectedDates) {
			value?.start.toString();
			value?.end.toString();
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

	async function getGraphData() {
		const response = await fetch(`/api/groups/${groupId}/assistances`,{
			method: 'POST',
			body: JSON.stringify()
		})
		data = getData(graphTypeInfo, groupId, dateRange);
	}

	return (
		<div className='flex flex-col gap-4 h-full p-4'>
			<div className='bg-stone-800 grow rounded p-2'>
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
				</RadioGroup>
				<DateRangePicker
					label='Seleccione un intérvalo de fechas'
					maxValue={today(getLocalTimeZone())}
					value={selectedDates}
					onChange={value => {
						handleGetDateRange(value);
					}}/>
				<Button className='px-2' color='secondary' onPress={getGraphData}><Icon name='insert_chart'/>Generar gráfico</Button>
			</div>
			<h2> Gráfico </h2>
			<StatisticsBarChart data={data}/>
		</div>
	);
}

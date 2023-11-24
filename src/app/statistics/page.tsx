'use client';
import React, {useState} from 'react';
import {type DateValue} from '@internationalized/date';
import {AttendanceType} from '@prisma/client';
import {RadioGroup, Radio} from '@/components/radio.tsx';
import DateRangePicker from '@/components/date-range-picker.tsx';
import {dateSchema} from '@/lib/statistics.ts';
import Chart from '@/components/chart.tsx';
import UserID from '@/app/statistics/user-id.tsx';
import GroupsList from "@/app/statistics/groups-list.tsx";
import AbsenceGraph from '@/app/statistics/absence-graph.tsx';
import JustificatedAbsenceGraph from '@/app/statistics/justificated-absence-graph.tsx';
import LateGraph from '@/app/statistics/late-graph.tsx';
import OntimeGraph from '@/app/statistics/ontime-graph.tsx';
import ComboBox from '@/components/combo-box.tsx';

export default function Home() {
	const userId = UserID();
	const groupList = GroupsList(userId);

	const [graphType, setGraphType] = useState('');
	const [dateRange, setDateRange] = useState<string>([]);
	const [groupId, setGroupId] = useState(0);

	const handleRadioSelection = () => {
		switch (graphType) {
			case AttendanceType.ON_TIME: {
				const data = OntimeGraph(groupId, dateRange);
				break;
			}

			case AttendanceType.LATE: {
				const data = LateGraph(groupId, dateRange);
				break;
			}

			case 'absence': {
				const data = AbsenceGraph(groupId, dateRange);
				break;
			}

			case AttendanceType.JUSTIFICATED_ABSENCE: {
				const data = JustificatedAbsenceGraph(groupId, dateRange);
				break;
			}

			default: {
				break;
			}
		}
	};

	const handleDateRange = () => {

	}

	return (
		<main className='flex flex-col h-full text-stone-400'>
			<div className='flex items-top mb-4 gap-4'>
				<h1 className='text-4xl text-stone-50'>
					Estadísticas
				</h1>
			</div>
			<div className='flex flex-col gap-4 h-full p-4'>
				<div className='bg-stone-800 grow rounded'>
					<RadioGroup label='Seleccione uno' onChange={handleRadioSelection}>
						<Radio value={AttendanceType.ON_TIME}>Registro de asistencias</Radio>
						<Radio value={AttendanceType.LATE}>Registro de retrasos</Radio>
						<Radio value='absence'>Registro de faltas</Radio>
						<Radio value={AttendanceType.JUSTIFICATED_ABSENCE}>Registro de faltas justificadas</Radio>
						<Radio value='entryHours'>Horas de registros</Radio>
					</RadioGroup>
					<ComboBox/>
					<DateRangePicker
						label='Seleccione un intérvalo de fechas'/>
					<h2> Gráfico </h2>
					<Chart/>
				</div>
			</div>
		</main>
	);
}

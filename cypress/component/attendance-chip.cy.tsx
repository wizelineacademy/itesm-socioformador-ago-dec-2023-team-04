import React from 'react';
import {CalendarDate, CalendarDateTime, Time} from '@internationalized/date';
import {type Attendance, AttendanceType, type Group, type Student} from '@prisma/client';
import {AttendanceChip} from '@/components/attendance-chip.tsx';

describe('<AttendanceChip />', () => {
	it('Recibe informacion y muestra el estado del alumno', () => {
		// See: https://on.cypress.io/mounting-react
		cy.mount(<AttendanceChip
			attendance={null}
			date={new CalendarDate(2023, 11, 28)}
			group={{
				entryTime: new Time(12, 0),
				enabledMonday: true,
				enabledTuesday: true,
				enabledWednesday: true,
				enabledThursday: true,
				enabledFriday: true,
				enabledSaturday: true,
				enabledSunday: true,
			}}
			serverTz='America/Mexico_City'
			onAttendanceChange={attendance => null}
		/>);
	});
});

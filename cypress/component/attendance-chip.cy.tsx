import React from 'react'
import { AttendanceChip } from '@/components/attendance-chip.tsx'
import {type CalendarDate, CalendarDateTime} from '@internationalized/date';
import {type Attendance, AttendanceType, type Group, type Student} from '@prisma/client';

describe('<AttendanceChip />', () => {
  const birthDate: CalendarDate = { year: 1990, month: 2, day: 1 };


  it('Recibe informacion y muestra el estado del alumno', () => {
    // see: https://on.cypress.io/mounting-react
    cy.mount(<AttendanceChip
        studentId={1}
        groupId={1}
        entryHour={new Date()}
        groupTz={'Pacific/Apia'}
        attendance={null}
        onAttendanceChange={attendance => null}
        date={birthDate}

    />)

  })
})
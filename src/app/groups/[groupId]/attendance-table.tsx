'use client';

import React, {useState} from 'react';
import {createColumnHelper} from '@tanstack/table-core';
import {type Key} from 'react-stately';
import {type GroupWithStudentsAttendance} from '@/lib/group.ts';
import {type Serializable} from '@/lib/serializable.ts';
import Table from '@/components/table.tsx';

const columnHelper = createColumnHelper<Serializable<GroupWithStudentsAttendance>['students'][number]>();

const columns = [
	columnHelper.accessor(item => `${item.student.givenName} ${item.student.familyName}`, {
		header: 'Alumno',
		cell: props => (
			props.cell.renderValue()
		),
	}),
];

export type AttendanceTableProps = {
	readonly group: Serializable<GroupWithStudentsAttendance>;
	readonly className?: string;
	readonly date: string;
};

export default function AttendanceTable(props: AttendanceTableProps) {
	const {group, className, date} = props;

	const [selectedKeys, setSelectedKeys] = useState(new Set<Key>());

	return (
		<Table
			data={group.students} columns={columns}
			selectedKeys={selectedKeys} getKey={student => student.studentId}
			onSelectedKeysChange={setSelectedKeys}/>
	);
}

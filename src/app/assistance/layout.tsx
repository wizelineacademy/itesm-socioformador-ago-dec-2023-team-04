import React, {type ReactNode} from 'react';
import {type Metadata} from 'next';

export const metadata: Metadata = {
	title: 'Toma de asistencia | SATS',
	description: 'metaphora. Student Attendance Tracking System',
};

export type AssistanceLayoutProps = {
	readonly children: ReactNode;
};

export default function AssistanceLayout(props: AssistanceLayoutProps) {
	const {children} = props;

	return children;
}

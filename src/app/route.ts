import {type Metadata} from 'next';
import {redirect} from 'next/navigation';

export const metadata: Metadata = {
	title: 'Inicio | SATS',
	description: 'metaphora. Student Attendance Tracking System',
};

// eslint-disable-next-line @typescript-eslint/naming-convention
export function GET() {
	redirect('/groups');
}

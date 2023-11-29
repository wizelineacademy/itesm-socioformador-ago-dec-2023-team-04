import {redirect} from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/naming-convention
export function GET() {
	redirect('/groups');
}

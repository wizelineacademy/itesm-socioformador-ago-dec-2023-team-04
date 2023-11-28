'use client';

import {DateFormatter, parseDate} from '@internationalized/date';

export type FormattedDateProps = {
	readonly date: string;
	readonly tz: string;
};

export default function FormattedDate(props: FormattedDateProps) {
	const {date, tz} = props;
	const formatter = new DateFormatter('es-MX', {
		dateStyle: 'full',
	});

	return formatter.format(parseDate(date).toDate(tz));
}

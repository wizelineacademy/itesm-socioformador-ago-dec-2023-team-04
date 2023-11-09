import {type RowData} from '@tanstack/table-core';
import {type Locale} from 'react-aria';

declare module '@tanstack/table-core' {
	// eslint-disable-next-line @typescript-eslint/naming-convention, @typescript-eslint/consistent-type-definitions
	interface TableMeta<TData extends RowData> {
		locale: Locale;
	}
}

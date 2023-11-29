import React from 'react';
import {useSearchFieldState, type SearchFieldProps as SearchFieldStateProps} from 'react-stately';
import {type AriaSearchFieldProps, useSearchField} from 'react-aria';
import Icon from '@/components/icon.tsx';
import {cx} from '@/lib/cva.ts';
import {Button} from '@/components/button.tsx';

export type SearchFieldProps = {
	readonly className?: string;
} & AriaSearchFieldProps & SearchFieldStateProps;

export default function SearchField(props: SearchFieldProps) {
	const {className} = props;
	const state = useSearchFieldState(props);
	const ref = React.useRef(null);
	const {inputProps, clearButtonProps} = useSearchField(props, state, ref);

	return (
		<div className={cx('bg-stone-700 h-10 rounded flex items-center justify-between p-1 gap-1', className)}>
			<Icon name='search' className='text-stone-400'/>
			<input
				{...inputProps} ref={ref} className='bg-transparent  outline-none  h-fit border-none appearance-none'
				placeholder='Buscar'/>
			{
				state.value === ''
					? <div className='bg-stone-800 text-stone-400 rounded align-middle text-sm py-1 px-2'>ctrl K</div>
					: <Button {...clearButtonProps} variant='text' color='tertiary' size='xs'><Icon name='close'/></Button>
			}
		</div>
	);
}

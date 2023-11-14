import React, {useRef} from 'react';
import {
	type AriaGridListOptions,
	mergeProps,
	useFocusRing,
	useGridList,
	useGridListItem,
	useGridListSelectionCheckbox,
} from 'react-aria';
import {useListState, type ListProps as ListStateProps, type ListState, type Node} from 'react-stately';
import Checkbox from '@/components/checkbox.tsx';
import {cx} from '@/lib/cva.ts';

export type ListProps<T> = {
	readonly className?: string;
} & ListStateProps<T> & AriaGridListOptions<T>;

export default function List<T extends object>(props: ListProps<T>) {
	const {className} = props;
	const state = useListState(props);
	const ref = useRef<HTMLUListElement>(null);
	const {gridProps} = useGridList(props, state, ref);

	return (
		<ul {...gridProps} ref={ref} className={cx('rounded border border-stone-700', className)}>
			{[...state.collection].map(item => (
				<ListItem key={item.key} item={item} state={state}/>
			))}
		</ul>
	);
}

type ListCheckboxProps<T> = {
	readonly item: Node<T>;
	readonly state: ListState<T>;
};

function ListCheckbox<T>(props: ListCheckboxProps<T>) {
	const {item, state} = props;
	const {checkboxProps} = useGridListSelectionCheckbox(
		{key: item.key},
		state,
	);
	return <Checkbox {...checkboxProps}/>;
}

type ListItemProps<T> = {
	readonly item: Node<T>;
	readonly state: ListState<T>;
};

function ListItem<T>(props: ListItemProps<T>) {
	const {item, state} = props;
	const ref = React.useRef(null);
	const {rowProps, gridCellProps, isPressed} = useGridListItem(
		{node: item},
		state,
		ref,
	);

	const {isFocusVisible, focusProps} = useFocusRing();
	const showCheckbox = state.selectionManager.selectionMode !== 'none'
        && state.selectionManager.selectionBehavior === 'toggle';

	return (
		<li
			{...mergeProps(rowProps, focusProps)}
			ref={ref}
			className={cx(
				'text-stone-300 p-2',
				isFocusVisible && 'border border-stone-50',
			)}
		>
			<div {...gridCellProps} className='flex items-center gap-2 outline-none'>
				{showCheckbox && <ListCheckbox item={item} state={state}/>}
				{item.rendered}
			</div>
		</li>
	);
}

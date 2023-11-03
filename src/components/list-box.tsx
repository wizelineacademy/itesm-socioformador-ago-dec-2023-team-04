import React, {forwardRef, useRef, type ForwardedRef} from 'react';
import {
	type AriaListBoxOptions,
	type AriaListBoxProps,
	type AriaOptionProps,
	mergeProps,
	useFocusRing,
	useListBox,
	useListBoxSection,
	useOption,
} from 'react-aria';
import {type ListProps, type ListState, type Node, useListState} from 'react-stately';
import {useObjectRef} from '@react-aria/utils';
import {cx} from '@/lib/cva.ts';

export type ListBoxProps<T> = BaseListBoxProps<T> | StatefulListBoxProps<T>;

export default forwardRef(<T extends object>(props: ListBoxProps<T>, ref: ForwardedRef<HTMLUListElement>) => (
	'state' in props
		? <BaseListBox {...props} ref={ref}/>
		: <StatefulListBox {...props} ref={ref}/>
));

type StatefulListBoxProps<T> = ListProps<T> & Omit<BaseListBoxProps<T>, 'state'>;

const StatefulListBox = forwardRef(<T extends object>(props: StatefulListBoxProps<T>, ref: ForwardedRef<HTMLUListElement>) => {
	const state = useListState(props);

	return (
		<BaseListBox {...props} ref={ref} state={state}/>
	);
});

type BaseListBoxProps<T> = {
	readonly className?: string;
	readonly state: ListState<T>;
} & AriaListBoxOptions<T>;

const BaseListBox = forwardRef(<T extends object>(props: BaseListBoxProps<T>, ref: ForwardedRef<HTMLUListElement>) => {
	const {state, label} = props;

	const listBoxRef = useObjectRef(ref);

	const {listBoxProps, labelProps} = useListBox(props, state, listBoxRef);

	return (
		<>
			{
				label && <div {...labelProps} className='text-stone-300 text-lg mb-2'>
					{label}
				</div>
			}
			<ul {...listBoxProps} ref={listBoxRef} className='p-2'>
				{
					[...state.collection].map(item => (
						item.type === 'section'
							? <Section key={item.key} section={item} state={state}/>
							: <Option key={item.key} item={item} state={state}/>
					))
				}
			</ul>
		</>
	);
});

type SectionProps<T> = {
	readonly section: Node<T>;
	readonly state: ListState<T>;
};

function Section<T>(props: SectionProps<T>) {
	const {section, state} = props;
	const {
		itemProps,
		headingProps,
		groupProps,
	} = useListBoxSection({
		heading: section.rendered,
		'aria-label': section['aria-label'],
	});

	return (
		<>
			{
				section.key === state.collection.getFirstKey()
					? null
					: <li
						className='border-t border-t-stone-700'
						role='presentation'/>
			}
			<li {...itemProps}>
				{
					section.rendered && (
						<span {...headingProps}>
							{section.rendered}
						</span>
					)
				}
				<ul {...groupProps}>
					{
						// The function getChildren will always exist
						[...state.collection.getChildren!(section.key)].map(node => (
							<Option key={node.key} item={node} state={state}/>
						))
					}
				</ul>
			</li>
		</>
	);
}

type OptionProps<T> = {
	readonly item: Node<T>;
	readonly state: ListState<T>;
};

function Option<T>(props: OptionProps<T>) {
	const {state, item} = props;

	const ref = useRef(null);

	const {optionProps, isSelected, isFocusVisible} = useOption({key: item.key}, state, ref);

	return (
		<li
			{...optionProps}
			ref={ref}
			className={cx(
				'p-1 text-stone-300 outline-none rounded ring-stone-200',
				!isSelected && 'hover:bg-stone-700',
				isSelected && 'text-stone-800 bg-wRed-500',
				isFocusVisible && 'ring-1',
			)}
		>
			{item.rendered}
		</li>
	);
}

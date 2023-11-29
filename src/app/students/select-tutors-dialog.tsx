import React, {useMemo} from 'react';
import {Item, type Key, useAsyncList, type ListData} from 'react-stately';
import Icon from '@/components/icon.tsx';
import Dialog from '@/components/dialog.tsx';
import ComboBox from '@/components/combo-box.tsx';
import List from '@/components/list.tsx';
import {Button} from '@/components/button.tsx';
import ButtonModalTrigger from '@/components/button-modal-trigger.tsx';
import Checkbox from '@/components/checkbox.tsx';
import {type StudentSearchResult} from '@/lib/students.ts';
import {type TutorsSearchResult} from '@/lib/tutors.ts';

export type SelectTutorsDialogProps = {
	readonly tutors: ListData<TutorsSearchResult>;
};

export default function SelectTutorsDialog(props: SelectTutorsDialogProps) {
	// Const {student, onStudentSelection, onStudentRemoval} = props;
	const {
		tutors,
	} = props;
	const keys = useMemo(() => new Set(tutors.items.map(student => student.id as Key)), [tutors]);
	const search = useAsyncList<StudentSearchResult>({
		async load({signal, filterText}) {
			if (filterText === undefined || filterText.trim() === '') {
				return {
					items: [] as StudentSearchResult[],
				};
			}

			const parameters = new URLSearchParams([
				['query', filterText.trim()],
			]);
			const response = await fetch('/api/tutors/search?' + parameters.toString(), {signal});

			const items = (await response.json()) as StudentSearchResult[];

			return {
				items: items.filter(student => !keys.has(student.id)),
			};
		},
	});

	const handleSelection = (key: Key) => {
		if (key === null) {
			return;
		}

		const student = search.getItem(key);
		search.setFilterText('');
		tutors.append(student);
	};

	return (
		<ButtonModalTrigger
			label={
				<>
					<Icon name='person_add' className='me-1'/> Agregar tutores
				</>
			} size='md'
			color='tertiary' variant='outlined' className='mb-4 w-full'
		>
			{
				close => (
					<Dialog title='Agregar tutores'>
						<ComboBox
							allowsCustomValue
							className='mb-4' items={search.items}
							iconName='search' label='Busca a un tutor'
							inputValue={search.filterText}
							onInputChange={search.setFilterText}
							onSelectionChange={handleSelection}
						>
							{
								item => (
									<Item>
										{`${item.givenName} ${item.familyName}`}
									</Item>
								)
							}
						</ComboBox>
						{
							tutors.items.length > 0 && (
								<>
									<div className='flex items-center mb-2 gap-2 px-2 border border-transparent text-stone-400 text-sm'>
										<Checkbox
											isSelected={tutors.selectedKeys === 'all'} onChange={checked => {
												if (checked) {
													tutors.setSelectedKeys('all');
												} else {
													tutors.setSelectedKeys(new Set());
												}
											}}/>
										<h5>
											Tutores seleccionados
										</h5>
									</div>
									<List
										items={tutors.items} aria-label='Tutores seleccionados' className='mb-4 max-h-72 overflow-y-scroll'
										selectionMode='multiple' selectedKeys={tutors.selectedKeys} onSelectionChange={tutors.setSelectedKeys}
									>
										{
											item => (
												<Item textValue={`${item.givenName} ${item.familyName}`}>
													{`${item.givenName} ${item.familyName}`}
													<span className='grow'/>
													<Button
														size='sm' color='tertiary' variant='text'
														className='ms-1'
														onPress={() => {
															tutors.remove(item.id);
														}}
													>
														<Icon name='delete' size='md'/>
													</Button>
												</Item>
											)
										}
									</List>
								</>

							)
						}

						<div className='flex justify-between items-center'>
							<Button color='destructive' isDisabled={tutors.selectedKeys !== 'all' && tutors.selectedKeys.size === 0} onPress={tutors.removeSelectedItems}>
								<Icon name='delete'/>
							</Button>
							<Button variant='outlined' color='secondary' onPress={close}>
								Cerrar
							</Button>
						</div>
					</Dialog>
				)
			}
		</ButtonModalTrigger>
	);
}

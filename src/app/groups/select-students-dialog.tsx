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

export type SelectStudentsDialogProps = {
	readonly students: ListData<StudentSearchResult>;
};

export default function SelectStudentsDialog(props: SelectStudentsDialogProps) {
	// Const {student, onStudentSelection, onStudentRemoval} = props;
	const {
		students,
	} = props;
	const studentKeys = useMemo(() => new Set(students.items.map(student => student.id as Key)), [students]);
	const studentSearch = useAsyncList<StudentSearchResult>({
		async load({signal, filterText}) {
			if (filterText === undefined || filterText.trim() === '') {
				return {
					items: [] as StudentSearchResult[],
				};
			}

			const parameters = new URLSearchParams([
				['query', filterText.trim()],
			]);
			const response = await fetch('/api/students/search?' + parameters.toString(), {signal});

			const items = (await response.json()) as TutorsSearchResult[];

			return {
				items: items.filter(student => !studentKeys.has(student.id)),
			};
		},
	});

	const handleSelection = (key: Key) => {
		if (key === null) {
			return;
		}

		const student = studentSearch.getItem(key);
		studentSearch.setFilterText('');
		students.append(student);
	};

	return (
		<ButtonModalTrigger
			label={
				<>
					<Icon name='person_add' className='me-1'/> Agregar estudiantes
				</>
			} size='md'
			color='tertiary' variant='outlined' className='mb-4 w-full'
		>
			{
				close => (
					<Dialog title='Agregar estudiantes'>
						<ComboBox
							allowsCustomValue
							className='mb-4' items={studentSearch.items}
							iconName='search' label='Busca a un estudiante'
							inputValue={studentSearch.filterText}
							onInputChange={studentSearch.setFilterText}
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
							students.items.length > 0 && (
								<>
									<div className='flex items-center mb-2 gap-2 px-2 border border-transparent text-stone-400 text-sm'>
										<Checkbox
											isSelected={students.selectedKeys === 'all'} onChange={checked => {
												if (checked) {
													students.setSelectedKeys('all');
												} else {
													students.setSelectedKeys(new Set());
												}
											}}/>
										<h5>
											Estudiantes seleccionados
										</h5>
									</div>
									<List
										items={students.items} aria-label='Estudiantes seleccionados' className='mb-4 max-h-72 overflow-y-scroll'
										selectionMode='multiple' selectedKeys={students.selectedKeys} onSelectionChange={students.setSelectedKeys}
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
															students.remove(item.id);
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
							<Button color='destructive' isDisabled={students.selectedKeys !== 'all' && students.selectedKeys.size === 0} onPress={students.removeSelectedItems}>
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

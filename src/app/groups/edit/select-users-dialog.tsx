import React, {useMemo} from 'react';
import {Item, type Key, useAsyncList, type ListData} from 'react-stately';
import Icon from '@/components/icon.tsx';
import Dialog from '@/components/dialog.tsx';
import ComboBox from '@/components/combo-box.tsx';
import List from '@/components/list.tsx';
import {Button} from '@/components/button.tsx';
import ButtonModalTrigger from '@/components/button-modal-trigger.tsx';
import Checkbox from '@/components/checkbox.tsx';
import {type UsersSearchResult} from '@/lib/users.ts';

export type SelectUsersDialogProps = {
	readonly users: ListData<UsersSearchResult>;
};

export default function SelectUsersDialog(props: SelectUsersDialogProps) {
	// Const {user, onUserSelection, onUserRemoval} = props;
	const {
		users,
	} = props;
	const userKeys = useMemo(() => new Set(users.items.map(user => user.id as Key)), [users]);
	const userSearch = useAsyncList<UsersSearchResult>({
		async load({signal, filterText}) {
			if (filterText === undefined || filterText.trim() === '') {
				return {
					items: [] as UsersSearchResult[],
				};
			}

			const parameters = new URLSearchParams([
				['query', filterText.trim()],
			]);
			const response = await fetch('/api/users/search?' + parameters.toString(), {signal});

			const items = (await response.json()) as UsersSearchResult[];

			return {
				items: items.filter(user => !userKeys.has(user.id)),
			};
		},
	});

	const handleUserSelection = (key: Key) => {
		if (key === null) {
			return;
		}

		const user = userSearch.getItem(key);
		userSearch.setFilterText('');
		users.append(user);
	};

	return (
		<ButtonModalTrigger
			label={
				<>
					<Icon name='person_add'/> Agregar usuarios
				</>
			} size='md'
			color='tertiary' variant='outlined' className='mb-4 w-full'
		>
			{
				close => (
					<Dialog title='Agregar usuarios'>
						<ComboBox
							allowsCustomValue
							className='mb-4' items={userSearch.items}
							iconName='search' label='Busca a un usuario'
							inputValue={userSearch.filterText}
							onInputChange={userSearch.setFilterText}
							onSelectionChange={handleUserSelection}
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
							users.items.length > 0 && (
								<>
									<div className='flex items-center mb-2 gap-2 px-2 border border-transparent text-stone-400 text-sm'>
										<Checkbox
											isSelected={users.selectedKeys === 'all'} onChange={checked => {
												if (checked) {
													users.setSelectedKeys('all');
												} else {
													users.setSelectedKeys(new Set());
												}
											}}/>
										<h5>
											Usuarios seleccionados
										</h5>
									</div>
									<List
										items={users.items} aria-label='Usuarios seleccionados' className='mb-4 max-h-72 overflow-y-scroll'
										selectionMode='multiple' selectedKeys={users.selectedKeys} onSelectionChange={users.setSelectedKeys}
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
															users.remove(item.id);
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
							<Button color='destructive' isDisabled={users.selectedKeys !== 'all' && users.selectedKeys.size === 0} onPress={users.removeSelectedItems}>
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

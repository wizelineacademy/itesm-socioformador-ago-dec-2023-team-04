import React from 'react';
import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';
import {getAllColors} from '@/lib/color.ts';
import GroupForm from '@/app/groups/edit/group-form.tsx';
import {type FormState} from '@/components/form.tsx';
import groupInitSchema, {type GroupInit} from '@/lib/schemas/group.ts';
import {decodeForm} from '@/lib/schemas/utils.ts';
import {createGroup} from '@/lib/groups.ts';
import {handleActionError} from '@/lib/action-utils.ts';

export default async function CreateGroupPage() {
	const colors = await getAllColors();

	const createGroupAction = async (state: FormState<GroupInit>, data: FormData) => {
		'use server';
		let groupId: number;
		try {
			const parsedData = await decodeForm(data, groupInitSchema);
			const group = await createGroup(parsedData);
			groupId = group.id;
		} catch (error) {
			console.log(error);
			return handleActionError(state, error);
		}

		revalidatePath('/groups');
		redirect(`/groups/edit/${groupId}`);
	};

	return (
		<>
			<h1 className='text-stone-200 text-lg'>
				Nuevo grupo
			</h1>
			<GroupForm colors={colors} action={createGroupAction}/>
		</>
	);
}

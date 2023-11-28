import React from 'react';
import {redirect} from 'next/navigation';
import {revalidatePath} from 'next/cache';
import {getAllColors} from '@/lib/color.ts';
import GroupForm from '@/app/groups/edit/group-form.tsx';
import {getGroupByIdWithStudentIds, updateGroup} from '@/lib/groups.ts';
import {type FormState} from '@/components/form.tsx';
import groupInitSchema, {type GroupInit} from '@/lib/schemas/group.ts';
import {decodeForm} from '@/lib/schemas/utils.ts';
import {handleActionError} from '@/lib/action-utils.ts';

export type EditGroupDetailPageProps = {
	readonly params: {
		readonly groupId: string;
	};
};

export default async function EditGroupDetailPage(props: EditGroupDetailPageProps) {
	const {params} = props;
	const groupId = Number.parseInt(params.groupId, 10);

	const group = await getGroupByIdWithStudentIds(groupId);

	if (group === null) {
		redirect('/groups/edit');
	}

	const colors = await getAllColors();

	const updateGroupAction = async (state: FormState<Partial<GroupInit>>, data: FormData) => {
		'use server';
		try {
			const parsedData = await decodeForm(data, groupInitSchema.partial());
			await updateGroup(groupId, parsedData);
		} catch (error) {
			return handleActionError(state, error);
		}

		revalidatePath('/groups');

		return {
			...state,
			formErrors: [],
			fieldErrors: {},
		};
	};

	return (
		<div>
			<h1 className='text-stone-200 text-lg'>
				Editando grupo
			</h1>
			<GroupForm group={group} colors={colors} action={updateGroupAction}/>
		</div>
	);
}

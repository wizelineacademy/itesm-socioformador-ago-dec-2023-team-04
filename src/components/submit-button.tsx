'use client';
import React from 'react';
import {useFormStatus} from 'react-dom';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';
import {cx} from '@/lib/cva.ts';

export default function SubmitButton() {
	const {pending} = useFormStatus();
	return (
		<Button type='submit' color='secondary' isDisabled={pending}>
			<Icon name='save' className='me-1'/>
			Guardar
		</Button>
	);
}

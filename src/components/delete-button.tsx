import React, {type ReactNode} from 'react';
import ButtonModalTrigger from '@/components/button-modal-trigger.tsx';
import Popover from '@/components/popover.tsx';
import ButtonPopoverTrigger from '@/components/button-popover-trigger.tsx';
import Icon from '@/components/icon.tsx';
import {Button} from '@/components/button.tsx';

export type DeleteButtonProps = {
	readonly className?: string;
	readonly label?: ReactNode;
	readonly onDelete: () => void;
	readonly isDisabled?: boolean;
};

export default function DeleteButton(props: DeleteButtonProps) {
	const {className, onDelete, label, isDisabled} = props;
	return (
		<ButtonPopoverTrigger isDisabled={isDisabled} label={<Icon name='delete'/>} color='destructive' className={className}>
			<div className='bg-stone-700 p-4 w-48 rounded'>
				<p className='text-stone-200 mb-2 text-sm'>
					{label}
				</p>
				<Button color='destructive' size='sm' onPress={onDelete}> Borrar </Button>
			</div>
		</ButtonPopoverTrigger>
	);
}

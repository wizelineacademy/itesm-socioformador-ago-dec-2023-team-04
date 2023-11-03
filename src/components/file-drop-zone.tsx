import React, {type ChangeEvent, type ReactNode, useRef, useState} from 'react';
import {type FileDropItem, mergeProps, useDrop, useFocusRing} from 'react-aria';
import {List} from 'immutable';
import {cx} from '@/lib/cva.ts';

export type FileDropZoneProps = {
	readonly fileUrl: string;
	readonly onFileUrlChange: (fileUrl: string) => void;
	readonly className?: string;
	readonly label?: ReactNode;
	readonly maxSize?: number;
	readonly acceptedFileTypes?: string[];
};

const Kb = 1024;

export default function FileDropZone(props: FileDropZoneProps) {
	const {label, className, acceptedFileTypes, fileUrl, onFileUrlChange, maxSize} = props;

	const [errorMessage, setErrorMessage] = useState('');

	const inputRef = useRef<HTMLInputElement>(null);

	const ref = useRef<HTMLDivElement>(null);

	const {isFocusVisible, focusProps} = useFocusRing();

	const isValidFile = (file: File) => {
		if (maxSize !== undefined && file.size > maxSize * Kb) {
			setErrorMessage(`El archivo no puede pesar mas de ${maxSize} KB.`);
			return false;
		}

		if (acceptedFileTypes !== undefined && !acceptedFileTypes.includes(file.type)) {
			setErrorMessage('Tipo de archivo incorrecto.');
			return false;
		}

		setErrorMessage('');
		return true;
	};

	const {dropProps, isDropTarget} = useDrop({
		ref,
		onDrop(event) {
			const item = event.items.find(item => item.kind === 'file') as FileDropItem | undefined;
			if (item === undefined) {
				return;
			}

			(
				async () => {
					const file = await item.getFile();
					if (isValidFile(file)) {
						onFileUrlChange(URL.createObjectURL(file));
					}
				}
			)();
		},
	});

	const inputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
		if (event.target.files === null) {
			return;
		}

		const file = List(event.target.files).find(element => isValidFile(element));

		event.target.value = '';

		if (file === undefined) {
			return;
		}

		onFileUrlChange(URL.createObjectURL(file));
	};

	const dropZoneClickHandler = () => {
		const input = inputRef.current;
		if (input !== null) {
			input.click();
		}
	};

	return (
		<div
			{...mergeProps(dropProps, focusProps)}
			ref={ref}
			role='button'
			tabIndex={0}
			className={cx(
				'rounded border border-dashed border-stone-500 p-4 text-stone-500 hover:bg-stone-800 outline-none flex justify-center items-center text-center',
				errorMessage !== '' && 'text-red-300',
				isDropTarget && 'bg-stone-800',
				isFocusVisible && 'border-stone-50',
				className,
			)}
			onClick={dropZoneClickHandler}
		>
			<input
				ref={inputRef}
				type='file' className='hidden'
				accept={acceptedFileTypes?.join(',')}
				onChange={inputChangeHandler}
			/>
			{errorMessage === '' ? label : errorMessage}
		</div>
	);
}

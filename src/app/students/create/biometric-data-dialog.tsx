import React, {useEffect, useRef, useState} from 'react';
import NextImage from 'next/image';
import {type Input} from '@stock17944/human';
import {Button} from '@/components/button.tsx';
import Dialog from '@/components/dialog.tsx';
import FileDropZone from '@/components/file-drop-zone.tsx';
import Icon from '@/components/icon.tsx';
import useFaceBiometrics from '@/lib/hooks/use-face-biometrics.ts';
import BiometricVideoInput from '@/app/students/create/biometric-video-input.tsx';
import {cx} from '@/lib/cva.ts';

export type BiometricDataDialogProps = {
	readonly onBiometricDataSubmission: (biometricData: number[]) => void;
	readonly close: () => void;
};

/**
 * Dialog component for collecting and submitting biometric data.
 * @param {BiometricDataDialogProps} props - The props for the BiometricDataDialog component.
 * @returns {JSX.Element} The BiometricDataDialog component.
 */
export default function BiometricDataDialog(props: BiometricDataDialogProps) {
	const {close, onBiometricDataSubmission} = props;

	const [imageUrl, setImageUrl] = useState<string>('');

	const videoRef = useRef<HTMLVideoElement>(null);

	const imageRef = useRef<HTMLImageElement>(null);

	const [showCamera, setShowCamera] = useState(false);

	const [biometricsInput, setBiometricsInput] = useState<Input>();

	useEffect(() => {
		if (showCamera && videoRef.current !== null) {
			console.log('using camera');
			setBiometricsInput(videoRef.current);
		} else if (imageUrl === '') {
			console.log('using none');
			setBiometricsInput(undefined);
		} else {
			(async () => {
				const image = new Image();

				image.addEventListener('load', () => {
					const canvas = document.createElement('canvas');
					canvas.width = image.width;
					canvas.height = image.height;
					console.log(`${image.width} ${image.height}`);

					const ctx = canvas.getContext('2d');
					if (ctx === null) {
						return;
					}

					ctx.drawImage(image, 0, 0, canvas.width, canvas.height);

					const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
					console.log(imageData);
					setBiometricsInput(imageData);
				});

				image.src = imageUrl;
			})();
		}
	}, [imageUrl, showCamera]);

	const {detection, isProcessing} = useFaceBiometrics({
		input: biometricsInput,
		isVideo: showCamera,
	});

	let detectionQuality: 'good' | 'medium' | 'bad' | 'unknown' = 'unknown';

	if (detection !== undefined) {
		if (detection.boxScore > 0.9) {
			detectionQuality = 'good';
		} else if (detection.boxScore > 0.8) {
			detectionQuality = 'medium';
		} else {
			detectionQuality = 'bad';
		}
	}

	return (
		<Dialog title='Registro de datos biometricos'>
			{
				showCamera
					? <BiometricVideoInput
						ref={videoRef} detection={detection} onImageSubmission={imageUrl => {
							setImageUrl(imageUrl);
							setShowCamera(false);
						}}
						onCancel={() => {
							setShowCamera(false);
						}}/>
					: <>
						{
							imageUrl === ''
								?	<FileDropZone
									className='w-96 h-56 mb-4'
									label='Da click para subir una imagen o suelta una imagen aqui.' fileUrl={imageUrl}
									acceptedFileTypes={['image/png', 'image/jpeg']} maxSize={1000} onFileUrlChange={setImageUrl}/>
								: <>
									<div className='w-96 h-56 relative rounded bg-stone-800 mb-4'>
										<NextImage ref={imageRef} fill src={imageUrl} alt='Imagen de datos biometricos' objectFit='contain'/>
									</div>
									<div className='mb-4 text-stone-300 flex items-center gap-2'>
										<span className={cx(
											'w-2 h-2 rounded-xl inline-block',
											detectionQuality === 'good' && 'bg-green-500',
											detectionQuality === 'medium' && 'bg-yellow-500',
											detectionQuality === 'bad' && 'bg-red-500',
											detectionQuality === 'unknown' && 'bg-stone-400',
										)}/>
										{
											{
												good: 'Detección de alta calidad',
												medium: 'Detección de calidad media',
												bad: 'Detección de baja calidad, es recomendado usar una imagen diferente.',
												unknown: isProcessing ? 'Procesando…' : 'No hay ninguna cara en la imagen',
											}[detectionQuality]
										}
									</div>
								</>
						}

						<div className='flex w-full justify-end gap-4'>
							<Button
								color='destructive'
								isDisabled={imageUrl === ''} onPress={() => {
									setImageUrl('');
								}}
							>
								<Icon name='delete'/>
							</Button>
							<Button
								color='secondary' onPress={() => {
									setShowCamera(true);
								}}
							>
								<Icon name='photo_camera'/>
							</Button>

							<span className='grow'/>
							<Button color='secondary' variant='outlined' onPress={close}>Cancelar</Button>
							<Button
								isDisabled={detection === undefined} color='secondary' onPress={() => {
									if (detection === undefined) {
										return;
									}

									// Face descriptors are enabled via config
									onBiometricDataSubmission(detection.embedding!);
									close();
								}}
							><Icon name='save' className='me-1'/>Guardar</Button>
						</div>
					</>
			}
		</Dialog>
	);
}

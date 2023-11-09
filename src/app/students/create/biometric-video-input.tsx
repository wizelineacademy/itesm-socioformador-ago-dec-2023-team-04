import React, {type ForwardedRef, forwardRef, useEffect} from 'react';
import {type FaceResult} from '@stock17944/human';
import {Item} from 'react-stately';
import {useObjectRef} from '@react-aria/utils';
import {cx} from '@/lib/cva.ts';
import Select from '@/components/select.tsx';
import useWebcam from '@/lib/hooks/use-webcam.ts';
import {Button} from '@/components/button.tsx';
import Icon from '@/components/icon.tsx';

export type BiometricVideoInputProps = {
	readonly detection: FaceResult | undefined;
	readonly onImageSubmission: (imageUrl: string) => void;
	readonly onCancel: () => void;
};

const BiometricVideoInput = forwardRef((props: BiometricVideoInputProps, ref: ForwardedRef<HTMLVideoElement>) => {
	const {detection, onImageSubmission, onCancel} = props;

	const videoRef = useObjectRef(ref);

	const {cameras, selectedCamera, setSelectedCamera, cameraStream} = useWebcam({});

	useEffect(() => {
		const video = videoRef.current;
		if (video !== null && cameraStream !== undefined) {
			video.srcObject = cameraStream;
		}
	}, [cameraStream, videoRef]);

	const handleImageSubmission = () => {
		const video = videoRef.current;
		const canvas = document.createElement('canvas');
		canvas.width = video.videoWidth;
		canvas.height = video.videoHeight;

		const ctx = canvas.getContext('2d');
		if (ctx === null) {
			return;
		}

		ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

		onImageSubmission(canvas.toDataURL());
	};

	let detectionQuality: 'good' | 'medium' | 'bad' | null = null;

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
		<>
			<div className={cx('relative mb-4')}>
				<div className={cx(
					'rounded absolute top-0 left-0 right-0 bottom-0 w-full h-full z-10',
					detectionQuality === 'good' && 'border-4 border-green-500',
					detectionQuality === 'medium' && 'border-4 border-yellow-500',
					detectionQuality === 'bad' && 'border-4 border-red-500',
				)}/>
				<video
					ref={videoRef}
					autoPlay className={cx('rounded h-96')}/>
			</div>
			<div className='flex items-end mb-4 gap-4'>
				<Select
					label='Camara a usar'
					items={cameras} selectedKey={selectedCamera} onSelectionChange={key => {
					// Guaranteed to be a string
						setSelectedCamera(key as string);
					}}
				>
					{
						item => (
							<Item key={item.deviceId}>
								{item.label}
							</Item>
						)
					}
				</Select>
				<div className='grow'/>
				<Button color='secondary' variant='outlined' onPress={onCancel}>
					Cancelar
				</Button>
				<Button
					color='secondary' onPress={handleImageSubmission}
				>
					<Icon name='photo_camera' className='me-1'/> Tomar foto
				</Button>
			</div>

		</>
	);
});

export default BiometricVideoInput;

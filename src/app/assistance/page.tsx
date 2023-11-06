'use client';
import React, {useEffect, useRef, useState} from 'react';
import {Item} from 'react-stately';
import {useQuery} from 'react-query';
import {type FaceResult} from '@stock17944/human';
import {List} from 'immutable';
import useWebcam from '@/lib/schemas/use-webcam.ts';
import Select from '@/components/select.tsx';
import ButtonModalTrigger from '@/components/button-modal-trigger.tsx';
import Icon from '@/components/icon.tsx';
import Dialog from '@/components/dialog.tsx';
import useFaceBiometrics from '@/lib/schemas/use-face-biometrics.ts';
import {type StudentWithSimilarity} from '@/lib/student.ts';
import {Button} from '@/components/button.tsx';
import {cx} from '@/lib/cva.ts';

function calculateFaceSimilarity(f1: FaceResult, f2: FaceResult) {
	const d1 = f1.embedding;
	const d2 = f2.embedding;

	if (d1 === undefined || d2 === undefined) {
		return undefined;
	}

	const differences = List(d1)
		.zip(List(d2))
		.map(([v1, v2]) => (v1 - v2) ** 2);

	let sum = 0;

	for (const difference of differences) {
		sum += difference;
	}

	return 1 - (Math.sqrt(sum * 60) / 100);
}

export default function AssistancePage() {
	const videoRef = useRef<HTMLVideoElement>(null);

	const {cameras, cameraStream, selectedCamera, setSelectedCamera} = useWebcam({});

	const {detection: liveDetection} = useFaceBiometrics({
		isVideo: true,
		input: videoRef.current ?? undefined,
	});

	const [lastDetection, setLastDetection] = useState<FaceResult>();

	useEffect(() => {
		if (liveDetection === undefined || lastDetection === undefined) {
			setLastDetection(liveDetection);
			return;
		}

		const similarity = calculateFaceSimilarity(lastDetection, liveDetection);

		if (similarity !== undefined && similarity < 0.5) {
			setLastDetection(liveDetection);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [liveDetection]);

	useEffect(() => {
		if (videoRef.current === null) {
			return;
		}

		videoRef.current.srcObject = cameraStream ?? null;
	}, [cameraStream]);

	const {data} = useQuery(['detection', lastDetection], async () => {
		const response = await fetch('/api/detection', {
			method: 'POST',

			body: JSON.stringify(lastDetection!.embedding!),
		});

		return await response.json() as StudentWithSimilarity;
	}, {
		enabled: lastDetection?.embedding !== undefined,
	});

	let detectionQuality: 'good' | 'medium' | 'bad' | 'unknown' = 'unknown';

	if (liveDetection !== undefined) {
		if (liveDetection.boxScore > 0.9) {
			detectionQuality = 'good';
		} else if (liveDetection.boxScore > 0.8) {
			detectionQuality = 'medium';
		} else if (liveDetection.boxScore > 0.7) {
			detectionQuality = 'bad';
		}
	}

	return (
		<div className='h-full gap-4 flex flex-col'>
			<div className='grow w-full overflow-hidden'>
				<video
					ref={videoRef} autoPlay className={cx(
						'h-full w-full object-cover',
						detectionQuality === 'good' && 'border-4 border-green-500',
						detectionQuality === 'medium' && 'border-4 border-yellow-500',
						detectionQuality === 'bad' && 'border-4 border-red-500')}/>
			</div>
			<div className='w-full items-center flex  gap-4'>
				<div className='text-stone-300 text-6xl'>
					11:11 AM
				</div>
				<div className='grow'/>
				<div className='text-stone-300 text-4xl'>
					{data && `${data.givenName} ${data.familyName}`}
				</div>

				<ButtonModalTrigger label={<Icon name='settings'/>} size='xl'>
					{
						close => (
							<Dialog>
								<Select
									label='Cámara a usar'
									className='mb-4'
									items={cameras} selectedKey={selectedCamera} onSelectionChange={key => {
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
								<div className='flex gap-4 justify-end'>
									<Button variant='outlined' onPress={close}>
										Cerrar
									</Button>
								</div>

							</Dialog>
						)
					}
				</ButtonModalTrigger>
			</div>

		</div>
	);
}

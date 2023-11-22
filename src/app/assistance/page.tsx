'use client';
import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Item} from 'react-stately';
import {useQuery} from 'react-query';
import {type FaceResult} from '@stock17944/human';
import {List} from 'immutable';
import {useCountdown} from 'usehooks-ts';
import {clamp, motion, useMotionTemplate, useMotionValue, useSpring, useTransform} from 'framer-motion';
import useWebcam from '@/lib/hooks/use-webcam.ts';
import Select from '@/components/select.tsx';
import ButtonModalTrigger from '@/components/button-modal-trigger.tsx';
import Icon from '@/components/icon.tsx';
import Dialog from '@/components/dialog.tsx';
import useFaceBiometrics from '@/lib/hooks/use-face-biometrics.ts';
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

	const {result} = useFaceBiometrics({
		isVideo: true,
		input: videoRef.current ?? undefined,
	});

	const lastResult = useRef<FaceResult>();

	const [count, {startCountdown, stopCountdown, resetCountdown}]
		= useCountdown({
			isIncrement: true,
			countStart: 0,
			countStop: 100,
			intervalMs: 12.5,
		});

	const detection = useMemo(() => {
		if (result === undefined) {
			stopCountdown();
			resetCountdown();
			lastResult.current = undefined;
			return;
		}

		if (lastResult.current === undefined) {
			startCountdown();
			lastResult.current = result;
			return result;
		}

		const similarity = calculateFaceSimilarity(lastResult.current, result);

		if (similarity !== undefined && similarity > 0.5) {
			startCountdown();
			return lastResult.current;
		}

		resetCountdown();
		lastResult.current = result;
		return result;
	}, [result]);

	useEffect(() => {
		if (videoRef.current === null) {
			// Shouldn't happen, effects are run after DOM nodes are mounted
			return;
		}

		videoRef.current.srcObject = cameraStream ?? null;
	}, [cameraStream]);

	const {data} = useQuery(['detection', detection], async () => {
		if (detection === undefined) {
			return;
		}

		const response = await fetch('/api/detection', {
			method: 'POST',

			body: JSON.stringify(detection.embedding),
		});

		return await response.json() as StudentWithSimilarity;
	}, {
		enabled: count === 100,
	});

	// Let detectionQuality: 'good' | 'medium' | 'bad' | 'unknown' = 'unknown';
	//
	// if (result !== undefined) {
	// 	if (result.boxScore > 0.9) {
	// 		detectionQuality = 'good';
	// 	} else if (result.boxScore > 0.8) {
	// 		detectionQuality = 'medium';
	// 	} else if (result.boxScore > 0.7) {
	// 		detectionQuality = 'bad';
	// 	}
	// }

	const animations = {
		detecting: {},
		waiting: {},
	};

	const progress = useMotionValue(0);

	useEffect(() => {
		progress.set(count);
	}, [count, progress]);

	const progressWithSpring = useSpring(progress, {damping: 20});

	const topWidth = useTransform(() => clamp(0, 100, (progressWithSpring.get() / 25) * 100));
	const rightHeight = useTransform(() => clamp(0, 100, ((progressWithSpring.get() - 25) / 25) * 100));
	const bottomWidth = useTransform(() => clamp(0, 100, ((progressWithSpring.get() - 50) / 25) * 100));
	const leftHeight = useTransform(() => clamp(0, 100, ((progressWithSpring.get() - 75) / 25) * 100));

	const topWidthPercent = useMotionTemplate`${topWidth}%`;
	const rightHeightPercent = useMotionTemplate`${rightHeight}%`;
	const bottomWidthPercent = useMotionTemplate`${bottomWidth}%`;
	const leftHeightPercent = useMotionTemplate`${leftHeight}%`;

	return (
		<div className='h-screen gap-4 flex flex-col p-4'>
			<div className='grow overflow-hidden border relative rounded'>
				<motion.div
					className='absolute top-0 left-0 border-green-400 h-0 border-t-8' style={{
						width: topWidthPercent,
					}}
				/>
				<motion.div
					className='absolute top-0 right-0 border-green-400 w-0 border-r-8' style={{
						height: rightHeightPercent,
					}}/>
				<motion.div
					className='absolute bottom-0 right-0 border-green-400 h-0 border-b-8' style={{
						width: bottomWidthPercent,
					}}/>
				<motion.div
					className='absolute bottom-0 left-0 border-green-400 w-0 border-l-8' style={{
						height: leftHeightPercent,
					}}/>
				<video
					ref={videoRef}
					autoPlay
					className={cx(
						'h-full w-full object-cover rounded',
					)}
				/>
				<canvas/>
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

'use client';
import React, {Suspense, useEffect, useMemo, useRef, useState} from 'react';
import {useQuery} from 'react-query';
import {type FaceResult} from '@stock17944/human';
import {useCountdown} from 'usehooks-ts';
import {clamp, motion, useMotionTemplate, useMotionValue, useSpring, useTransform} from 'framer-motion';
import {Item} from 'react-stately';
import useWebcam from '@/lib/hooks/use-webcam.ts';
import useFaceBiometrics from '@/lib/hooks/use-face-biometrics.ts';
import {type StudentWithSimilarity} from '@/lib/students.ts';
import {cx} from '@/lib/cva.ts';
import ButtonModalTrigger from '@/components/button-modal-trigger.tsx';
import Icon from '@/components/icon.tsx';
import Dialog from '@/components/dialog.tsx';
import Select from '@/components/select.tsx';
import {Button} from '@/components/button.tsx';
import {calculateFaceSimilarity} from '@/lib/calculate-face-similarity.ts';
import Loading from '@/app/assistance/loading.tsx';

const rootVariants = {
	idle: {},
	detecting: {},
	detected: {},
};

const borderVariants = {
	idle: {
		borderColor: 'var(--idle-color)',
	},
	detecting: {
		borderColor: 'var(--detecting-color)',
	},
	detected: {
		borderColor: 'var(--detected-color)',
	},
};

const messageVariants = {
	idle: {
		height: '0px',
		visibility: 'hidden' as const,
		opacity: 0,
	},
	detecting: {
		height: '0px',
		visibility: 'hidden' as const,
		opacity: 0,
	},
	detected: {
		height: 'fit-content' as const,
		visibility: 'visible' as const,
		opacity: 100,
		transition: {
			delay: 0.2,
		},
	},
};

const hourVariants = {
	idle: {
		fontSize: 'var(--idle-font-size)',
	},
	detecting: {
		fontSize: 'var(--idle-font-size)',
	},
	detected: {
		fontSize: 'var(--detected-font-size)',
		transition: {
			delay: 0.2,
		},
	},
};

export default function AssistancePage() {
	const videoRef = useRef<HTMLVideoElement>(null);

	const [submitting, setSubmitting] = useState(false);

	const {cameras, cameraStream, selectedCamera, setSelectedCamera} = useWebcam({});

	const {result: liveResult} = useFaceBiometrics({
		isVideo: true,
		input: videoRef.current ?? undefined,
	});

	const lastResult = useRef<FaceResult>();

	const [detectionProgress, detectionProgressController]
		= useCountdown({
			isIncrement: true,
			countStart: 0,
			countStop: 100,
			intervalMs: 5,
		});

	const animationProgress = useMotionValue(0);

	useEffect(() => {
		animationProgress.set(detectionProgress);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [detectionProgress]);

	const result = useMemo(() => {
		if (detectionProgress === 100) {
			return lastResult.current;
		}

		if (liveResult === undefined) {
			lastResult.current = undefined;
			return;
		}

		if (lastResult.current === undefined) {
			lastResult.current = liveResult;
			return liveResult;
		}

		const similarity = calculateFaceSimilarity(lastResult.current, liveResult);

		if (similarity !== undefined && similarity > 0.4) {
			return lastResult.current;
		}

		return liveResult;
		// The countdown controller is not stable
	}, [liveResult, detectionProgress]);

	useEffect(() => {
		if (videoRef.current === null) {
			// Shouldn't happen, effects are run after DOM nodes are mounted
			return;
		}

		videoRef.current.srcObject = cameraStream ?? null;
	}, [cameraStream]);

	const {data: recognizedStudent} = useQuery(['detection', result], async () => {
		if (result === undefined) {
			return;
		}

		const response = await fetch('/api/students/match', {
			method: 'POST',
			body: JSON.stringify(result.embedding),
		});

		if (!response.ok) {
			return;
		}

		return await response.json() as StudentWithSimilarity;
	}, {
		enabled: result !== undefined,
	});

	useEffect(() => {
		void (async () => {
			if (recognizedStudent === undefined) {
				detectionProgressController.stopCountdown();
				detectionProgressController.resetCountdown();
				return;
			}

			detectionProgressController.startCountdown();

			if (detectionProgress !== 100) {
				return;
			}

			const recognition = recognizedStudent;

			const response = await fetch(`api/students/${recognition.id}/assistance`, {
				method: 'POST',
			});

			const timeout = setTimeout(() => {
				detectionProgressController.resetCountdown();
				setTimeout(() => {
					detectionProgressController.startCountdown();
				}, 3000);
			}, 2000);
			return () => {
				if (detectionProgress > 0) {
					clearTimeout(timeout);
					detectionProgressController.resetCountdown();
					detectionProgressController.startCountdown();
				}
			};
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [recognizedStudent, detectionProgress]);

	const progressWithSpring = useSpring(animationProgress, {bounce: 0, mass: 1});

	const topWidth = useTransform(() => clamp(0, 100, (progressWithSpring.get() / 50) * 100));
	const rightHeight = useTransform(() => clamp(0, 100, ((progressWithSpring.get() - 50) / 50) * 100));
	const bottomWidth = useTransform(() => clamp(0, 100, ((progressWithSpring.get()) / 50) * 100));
	const leftHeight = useTransform(() => clamp(0, 100, ((progressWithSpring.get() - 50) / 50) * 100));

	const topWidthPercent = useMotionTemplate`${topWidth}%`;
	const rightHeightPercent = useMotionTemplate`${rightHeight}%`;
	const bottomWidthPercent = useMotionTemplate`${bottomWidth}%`;
	const leftHeightPercent = useMotionTemplate`${leftHeight}%`;

	let variant: keyof typeof rootVariants = result ? 'detecting' : 'idle';
	if (detectionProgress === 100) {
		variant = 'detected';
	}

	return (
		<Suspense fallback={<Loading/>}>
			<motion.div layout animate={variant} variants={rootVariants} className='h-screen gap-2 flex flex-col p-4'>
				<motion.div
					layout
					className='grow overflow-hidden relative rounded [--submitted-color:theme(colors.stone.100)] [--detecting-color:theme(colors.yellow.400)] [--idle-color:theme(colors.red.400)] [--detected-color:theme(colors.green.400)]'
				>
					<motion.div
						layout
						className='absolute top-0 left-0 h-0 border-t-8 '
						variants={borderVariants}
						style={{
							width: topWidthPercent,
						}}
					/>
					<motion.div
						layout
						className='absolute top-0 right-0 border-green-400 w-0 border-r-8'
						variants={borderVariants}
						style={{
							height: rightHeightPercent,
						}}/>
					<motion.div
						layout
						className='absolute bottom-0 right-0 border-green-400 h-0 border-b-8'
						variants={borderVariants}
						style={{
							width: bottomWidthPercent,
						}}/>
					<motion.div
						layout
						className='absolute bottom-0 left-0 border-green-400 w-0 border-l-8'
						variants={borderVariants}
						style={{
							height: leftHeightPercent,
						}}/>
					<motion.video
						ref={videoRef}
						autoPlay
						className={cx(
							'h-full w-full object-cover rounded',
						)}
					/>
				</motion.div>

				<motion.div
					layout
					className='text-8xl text-stone-300'
					variants={messageVariants}
				>
					{recognizedStudent && `Hola, ${recognizedStudent?.givenName} ${recognizedStudent?.familyName}`}
				</motion.div>

				<motion.div className='w-full items-center flex  gap-4'>
					<motion.div className='text-stone-300 [--idle-font-size:theme(fontSize.6xl)] [--detected-font-size:theme(fontSize.5xl)]' variants={hourVariants}>
						11:11 AM
					</motion.div>
					<div className='grow'/>
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
				</motion.div>

			</motion.div>
		</Suspense>
	);
}

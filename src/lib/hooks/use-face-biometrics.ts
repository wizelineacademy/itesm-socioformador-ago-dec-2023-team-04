import {useEffect, useState} from 'react';
import type {FaceResult, Human, Input, Config} from '@stock17944/human';
import {List} from 'immutable';

const humanSettings: Partial<Config> = {
	backend: 'humangl',
	body: {
		enabled: false,
	},
	filter: {
		enabled: false,
	},
	modelBasePath: '/models/',
	object: {
		enabled: false,
	},
	gesture: {
		enabled: false,
	},
	hand: {
		enabled: false,
	},
	segmentation: {
		enabled: false,
	},
	face: {
		iris: {
			enabled: false,
		},
		emotion: {
			enabled: false,
		},
		attention: {
			enabled: false,
		},
		description: {
			enabled: true,
		},
	},
};

export type FaceBiometricsOptions = {
	readonly isEnabled?: boolean;
	readonly isVideo?: boolean;
	readonly input?: Input;
};

/**
 * Perform face biometrics assistance or initialize video processing loop if enabled.
 *
 * @param {FaceBiometricsOptions} options - The options for face biometrics.
 * @param {boolean} options.isEnabled - Flag indicating whether face biometrics is enabled. Default is true.
 * @param {boolean} options.isVideo - Flag indicating whether video processing is enabled. Default is true.
 * @param {Input} options.input - The input for face biometrics assistance.
 * @return {{ assistance?: FaceResult, isProcessing: boolean }} - The detected face result and the processing status.
 */
export default function useFaceBiometrics(options: FaceBiometricsOptions): {
	result?: FaceResult;
	isProcessing: boolean;
} {
	const {isEnabled = true, isVideo = true, input} = options;

	const [isProcessing, setIsProcessing] = useState(false);

	const [human, setHuman] = useState<Human>();
	const [detection, setDetection] = useState<FaceResult>();

	// Load assistance library asynchronously, and only on the client.
	useEffect(() => {
		if (!isEnabled) {
			return;
		}

		(async () => {
			const humanLib = await import('@stock17944/human/client');
			const human = new humanLib.Human(humanSettings);

			setHuman(human);
		})();
	}, [isEnabled]);

	// Perform assistance or initialize video processing loop if enabled
	useEffect(() => {
		console.log('checking');
		if (!isEnabled || input === undefined || human === undefined) {
			return;
		}

		if (!isVideo) {
			setIsProcessing(true);
			(async () => {
				const result = await human.detect(input);
				const bestResult = List(result.face).maxBy(value => value.boxScore);
				setDetection(bestResult);
				setIsProcessing(false);
			})();

			return () => {
				setDetection(undefined);
			};
		}

		let stopFlag = false;
		setIsProcessing(true);

		async function detectVideo(human: Human, input: Input) {
			const result = await human.detect(input, humanSettings);

			const bestResult = List(result.face).maxBy(value => value.boxScore);

			setDetection(bestResult);

			if (stopFlag) {
				return;
			}

			requestAnimationFrame(() => {
				void detectVideo(human, input);
			});
		}

		void detectVideo(human, input);

		return () => {
			stopFlag = true;
			setIsProcessing(false);
			setDetection(undefined);
		};
	}, [isEnabled, input, human, isVideo]);

	return {
		result: detection,
		isProcessing,
	};
}

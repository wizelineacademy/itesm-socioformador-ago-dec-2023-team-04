import {useEffect, useState} from 'react';
import {useListData} from 'react-stately';

export type WebcamProps = {
	readonly enabled?: boolean;
};

export default function useWebcam(props: WebcamProps) {
	const {enabled = true} = props;

	const {items: cameras, append: appendCameras} = useListData<MediaDeviceInfo>({
		getKey(item) {
			return item.deviceId;
		},
	});

	const [permissionGranted, setPermissionGranted] = useState(false);

	const [selectedCamera, setSelectedCamera] = useState('');

	const [cameraStream, setCameraStream] = useState<MediaStream>();

	useEffect(() => {
		if (!permissionGranted) {
			return;
		}

		(async () => {
			const devices = await navigator.mediaDevices.enumerateDevices();
			if (devices.length > 0) {
				const cameraDevices = devices.filter(({kind}) => kind === 'videoinput');
				appendCameras(...cameraDevices);
				setSelectedCamera(cameraDevices[0].deviceId);
			}
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [permissionGranted]);

	useEffect(() => {
		if (!enabled) {
			return;
		}

		let constraint: MediaStreamConstraints;

		if (selectedCamera === '') {
			constraint = {
				video: true,
			};
		} else {
			constraint = {
				video: {
					deviceId: selectedCamera,
				},
			};
		}

		// This prevents a race condition in which the cleanup function ran before the assign function
		const assignPromise = (async () => {
			const stream = await navigator.mediaDevices.getUserMedia(constraint);
			setPermissionGranted(true);
			setCameraStream(stream);
			return stream;
		})();

		return () => {
			(async () => {
				const stream = await assignPromise;

				for (const track of stream.getTracks()) {
					track.stop();
					track.enabled = false;
				}

				setCameraStream(undefined);
			})();
		};
	}, [selectedCamera, enabled]);
	return {
		cameras,
		selectedCamera,
		setSelectedCamera,
		cameraStream,
	};
}

import {renderHook, waitFor} from '@testing-library/react';
import {expect, jest, test} from '@jest/globals';
import useWebcam from '@/lib/hooks/use-webcam.ts';

navigator.mediaDevices = {
	enumerateDevices: jest.fn(async () => [
		{kind: 'videoinput', deviceId: '3'},
		{kind: 'audioinput', deviceId: '2'},
	]),
	getUserMedia: jest.fn(async (constraint: MediaStreamConstraints): Promise<MediaStream> => ({
		getAudioTracks(): MediaStreamTrack[] {
			return [];
		},
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		onaddtrack(this, ev) {},
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		onremovetrack(this, ev) {},
		active: false,
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		addTrack(track: MediaStreamTrack) {},
		clone() {
			return this as MediaStream;
		},
		dispatchEvent(event: Event): boolean {
			return false;
		},

		getTrackById(trackId: string): MediaStreamTrack | null {
			return null;
		},
		getTracks(): MediaStreamTrack[] {
			return [];
		},
		getVideoTracks(): MediaStreamTrack[] {
			return [];
		},
		id: '3',
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		removeTrack(track: MediaStreamTrack): void {},
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		addEventListener(type: string, callback: any | null, options?: AddEventListenerOptions | boolean) {},
		// eslint-disable-next-line @typescript-eslint/no-empty-function
		removeEventListener(type: string, callback: any | null, options?: EventListenerOptions | boolean) {},
	})),
};

describe('useWebcam', () => {
	test('should initialize with default values', () => {
		const {result} = renderHook(() => useWebcam({enabled: true}));

		// Assert default values
		expect(result.current.cameras).toEqual([]);
		expect(result.current.selectedCamera).toEqual('');
		expect(result.current.cameraStream).toBeUndefined();
	});

	test('should set permissionGranted and fetch cameras on permission granted', async () => {
		const {result} = renderHook(() => useWebcam({enabled: true}));
		await waitFor(() => {
			expect(result.current.cameras.length).toBe(1);
		});
		await waitFor(() => {
			expect(result.current.selectedCamera).toBe('3');
		});
		await waitFor(() => {
			expect(result.current.cameraStream).toBeDefined();
		});
	});
});

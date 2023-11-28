import { renderHook , act} from '@testing-library/react';
import {expect, jest, test} from '@jest/globals';
//import { useForm } from '@/lib/hooks/use-form.ts';
import useWebcam from '@/lib/hooks/use-webcam.ts';

describe('useWebcam', () => {
	test('should initialize with default values', () => {
		const { result } = renderHook(() => useWebcam({ enabled: true }));

		// Assert default values
		expect(result.current.cameras).toEqual([]);
		expect(result.current.selectedCamera).toEqual('');
		expect(result.current.cameraStream).toBeUndefined();
	});

	test('should set permissionGranted and fetch cameras on permission granted', async () => {
		const mockEnumerateDevices = jest.fn().mockResolvedValue([
			{ kind: 'videoinput', deviceId: '1' },]);

		const originalMediaDevices = navigator.mediaDevices;
		// @ts-ignore: Mocking mediaDevices for testing purpose
		navigator.mediaDevices = {
			enumerateDevices: mockEnumerateDevices,
			getUserMedia: jest.fn().mockResolvedValue({} as MediaStream),
		};

		const { result, waitForNextUpdate } = renderHook(() => useWebcam({ enabled: true }));

		await waitForNextUpdate();

		expect(result.current.permissionGranted).toBe(true);
		expect(result.current.cameras.length).toBe(2);
		expect(result.current.selectedCamera).toBe('1');
		expect(result.current.cameraStream).toBeDefined();

		// Restore original mediaDevices
		navigator.mediaDevices = originalMediaDevices;
	});

	test('should clean up camera stream on unmount or disable', async () => {
		const mockEnumerateDevices = jest.fn().mockResolvedValue([
			{ kind: 'videoinput', deviceId: '1' },
		]);

		const originalMediaDevices = navigator.mediaDevices;
		// @ts-ignore: Mocking mediaDevices for testing purpose
		navigator.mediaDevices = {
			enumerateDevices: mockEnumerateDevices,
			getUserMedia: jest.fn().mockResolvedValue({} as MediaStream),
		};

		const { result, unmount, rerender } = renderHook(
			(props: { enabled: boolean }) => useWebcam(props),
			{ initialProps: { enabled: true } }
		);

		await act(async () => {
			await result.current.cameraStream?.getTracks()[0].stop();
			rerender({ enabled: false });
		});

		expect(result.current.permissionGranted).toBe(false);
		expect(result.current.cameras.length).toBe(0);
		expect(result.current.selectedCamera).toBe('');
		expect(result.current.cameraStream).toBeUndefined();

		unmount();

		// Restore original mediaDevices
		navigator.mediaDevices = originalMediaDevices;
	});

});

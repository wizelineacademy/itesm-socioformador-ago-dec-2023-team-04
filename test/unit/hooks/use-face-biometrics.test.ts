import {expect, jest, test} from '@jest/globals';
import {renderHook} from '@testing-library/react';
import useFaceBiometrics, { FaceBiometricsOptions } from '@/lib/hooks/use-face-biometrics.ts';
import {Input} from "@stock17944/human";

const mockInput: Input = {
	image: {
		// Simulating image data for face detection
		data: 'TestImage',
		width: 640,
		height: 480,
	},
};
describe('useFaceBiometrics', () => {
	test('should return correct initial values', () => {
		const options: FaceBiometricsOptions = {
			isEnabled: true,
			isVideo: true,
			input: mockInput,
		};

		const { result } = renderHook(() => useFaceBiometrics(options));

		expect(result.current.result).toBeUndefined();
		expect(result.current.isProcessing).toBe(false);
	});

	test('should process face detection when isEnabled and input are defined', async () => {
		const options: FaceBiometricsOptions = {
			isEnabled: true,
			isVideo: false, // Testing with a static image, not video
			input: mockInput,
		};

		const { result, waitForNextUpdate } = renderHook(() => useFaceBiometrics(options));

		expect(result.current.isProcessing).toBe(true);
		await waitForNextUpdate();
		expect(result.current.isProcessing).toBe(false);
	});

});
export default useFaceBiometrics;
export { mockInput };

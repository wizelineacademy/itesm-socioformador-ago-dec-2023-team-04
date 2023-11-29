import {expect, jest, test} from '@jest/globals';
import { management } from '@/lib/auth0.ts';
require('jest-fetch-mock').enableMocks()

describe('Auth0 Management Client', () => {
	// @ts-ignore
	const mockFetch = jest.fn().mockResolvedValue({}); // Mock the fetch function

	beforeAll(() => {
		// Mock the global fetch function
		// @ts-ignore
		global.fetch = mockFetch;
	});

	afterAll(() => {
		// Restore the original fetch function after tests
		global.fetch.mockRestore();
	});

	test('should initialize ManagementClient with correct configuration', () => {
		// Ensure management object is initialized correctly
		expect(management).toBeDefined();
		expect(management.domain).toBe(process.env.AUTH0_DOMAIN);
		expect(management.clientId).toBe(process.env.AUTH0_CLIENT_ID);
		expect(management.clientSecret).toBe(process.env.AUTH0_CLIENT_SECRET);
	});

	test('should use no-cache option in fetch configuration', async () => {
		const url = 'https://metaphora.hiram.page/';
		await management.fetch(url, { method: 'GET' });

		// Check if fetch was called with the expected parameters
		expect(global.fetch).toHaveBeenCalledWith(url, {
			method: 'GET',
			cache: 'no-cache',
		});
	});

});

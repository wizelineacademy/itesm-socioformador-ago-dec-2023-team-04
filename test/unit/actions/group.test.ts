//import {render, screen} from '@testing-library/react';
import { upsertGroupAction, deleteGroups } from '@/lib/actions/group';
import prisma from '@/lib/prisma';
import {expect, jest, test} from '@jest/globals';


// Mocking the dependencies
jest.mock('@/lib/prisma', () => ({
	group: {
		create: jest.fn(),
		deleteMany: jest.fn(),
		update: jest.fn(),
	},
	$transaction: jest.fn(),
}));

describe('Group Actions', () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	describe('upsertGroupAction', () => {
		it('should create a new group when previousState.id is undefined', async () => {
			const formData = {}; // Mocking FormData
			const validatedGroup = { /* Mock validatedGroup data */ };

			// Mocking decodeForm function
			jest.spyOn<any, any>(helpers, 'decodeForm').mockResolvedValueOnce(validatedGroup);

			// Mocking prisma.group.create
			(prisma.group.create as jest.Mock).mockResolvedValueOnce({ id: 1 });

			const previousState = { id: undefined };
			const newState = await upsertGroupAction(previousState, formData);

			expect(newState.id).toEqual(1); // Asserting the new ID
			expect(prisma.group.create).toHaveBeenCalled(); // Verifying create method call
			expect(prisma.group.create).toHaveBeenCalledTimes(1); // Verifying create method call count
		});

	});

	describe('deleteGroups', () => {
		it('should delete groups by their IDs', async () => {
			const groupIds = [1, 2, 3]; // Mocking group IDs

			// Mocking prisma.group.deleteMany
			(prisma.group.deleteMany as jest.Mock).mockResolvedValueOnce({ count: groupIds.length });

			const result = await deleteGroups(groupIds);

			expect(result.success).toEqual(true); // Asserting success flag
			expect(prisma.group.deleteMany).toHaveBeenCalled(); // Verifying deleteMany method call
			expect(prisma.group.deleteMany).toHaveBeenCalledTimes(1); // Verifying deleteMany method call count
		});
	});
});

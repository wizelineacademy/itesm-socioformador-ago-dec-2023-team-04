import chai from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';
import { getAllColors } from '@/lib/color.ts';
import { createGroup, updateGroup } from '@/lib/groups.ts';
import { handleActionError } from '@/lib/action-utils.ts';
import CreateGroupPage from '@/app/groups/edit/create/page.tsx';
import EditGroupDetailPage from '@/app/groups/edit/[groupId]/page.tsx';
import {Time} from '@internationalized/date';


// @ts-ignore
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Color Tests', () => {
	afterEach(() => {
		sinon.restore();
	});

	describe('CreateGroupPage', () => {
		it('should handle createGroupAction', async () => {
			const fakeGroup = { id: 1, name: 'Test Group' };
			sinon.stub(getAllColors).resolves(['red', 'green', 'blue']);
			sinon.stub(handleActionError);

			sinon.stub(global, 'revalidatePath');
			sinon.stub(global, 'redirect');

			sinon.stub(global, 'FormData').returns(new FormData());

			sinon.stub(global.console, 'log');

			sinon.stub(global, 'createGroup').resolves(fakeGroup);

			const action = CreateGroupPage().then((page) => page.props.children.props.action);
			const state = {
				colors: ['red', 'green', 'blue'], //  colors array
				action: async (state, data) => {
				},
				group: {
					id: 1,
					name: 'Test Group',
					description: 'Test description',
					entryHour: new Time(9, 0),
					duration: 120, // Sample duration in minutes
					// Mocked student information
					students: [
						{ id: 101, name: 'Student 1' },
						{ id: 102, name: 'Student 2' },
					],
				},
				// Other states managed by useState in the component
				active: true, // Example value for active state
				daysActive: ['monday', 'tuesday'], // Example array of active days
				duration: 120, // Example duration in minutes
			};

			const data = new FormData();

			await expect(action(state, data)).to.eventually.deep.equal({
				formErrors: [],
				fieldErrors: {},
			});

			expect(handleActionError.called).to.be.false;
			expect(global.console.log.called).to.be.false;
			expect(global.revalidatePath.calledWith('/groups')).to.be.true;
			expect(global.redirect.calledWith('/groups/edit/1')).to.be.true;
		});
	});

	describe('EditGroupDetailPage', () => {
		it('should handle updateGroupAction', async () => {
			const fakeGroup = { id: 1, name: 'Test Group' };
			sinon.stub(getAllColors).resolves(['red', 'green', 'blue']);
			sinon.stub(handleActionError);

			sinon.stub(global, 'revalidatePath');

			sinon.stub(global, 'FormData').returns(new FormData());

			sinon.stub(global.console, 'log');

			sinon.stub(global, 'getGroupByIdWithStudentIds').resolves(fakeGroup);
			sinon.stub(global, 'updateGroup').resolves();

			const action = EditGroupDetailPage({ params: { groupId: '1' } }).then((page) => page.props.children.props.action);
			const state = {
				colors: ['red', 'green', 'blue'], //  colors array
				action: async (state, data) => {
				},
				group: {
					id: 1,
					name: 'Test Group',
					description: 'Test description',
					entryHour: new Time(9, 0),
					duration: 120, // Sample duration in minutes
					// Mocked student information
					students: [
						{ id: 101, name: 'Student 1' },
						{ id: 102, name: 'Student 2' },
					],
				},
				// Other states managed by useState in the component
				active: true, // Example value for active state
				daysActive: ['monday', 'tuesday'], // Example array of active days
				duration: 120, // Example duration in minutes
			};			const data = new FormData();

			await expect(action(state, data)).to.eventually.deep.equal({
				formErrors: [],
				fieldErrors: {},
			});

			expect(handleActionError.called).to.be.false;
			expect(global.console.log.called).to.be.false;
			expect(global.revalidatePath.calledWith('/groups')).to.be.true;
		});
	});
});

import React from 'react';
import {Color} from '@prisma/client';
import ColorRadioGroup from '@/components/color-selector.tsx';

describe('<ColorRadioGroup />', () => {
	it('Muestra Los selectores y verifica que fucnionan', () => {
		// See: https://on.cypress.io/mounting-react
		cy.mount(<ColorRadioGroup colors={[
			{id: 1, code: 'a8a29e'},

			{id: 2, code: 'f87171'},
		]}/>);
		cy.get('[style="background-color: rgb(168, 162, 158);"]').click();
		cy.wait(500);
		cy.get('[style="background-color: rgb(248, 113, 113);"]').click();
	});
});

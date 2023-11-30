import React from 'react';
import DeleteButton from '@/components/delete-button.tsx';

describe('<DeleteButton />', () => {
	it('Abre el popup al presionar el boton', () => {
		// See: https://on.cypress.io/mounting-react

		const deleteSpy = cy.spy().as('delete handler');
		cy.mount(<DeleteButton onDelete={deleteSpy}/>);
		cy.get('button').click();
	});
});

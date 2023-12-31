import React from 'react';
import {NumberField} from '@/components/number-field.tsx';

describe('<NumberField />', () => {
	it('El espacio de numeros funciona correctamente', () => {
		// See: https://on.cypress.io/mounting-react
		cy.mount(<NumberField/>);
		cy.get('input').type('12345');
	});
	it('Los Botones funcionan correctamente', () => {
		// See: https://on.cypress.io/mounting-react
		const onChangeSpy = cy.spy().as('onChangeSpy');
		cy.mount(<NumberField onChange={onChangeSpy}/>);
		cy.get('[aria-label="Increase"] > .material-symbols-rounded').click();
		cy.get('[aria-label="Increase"] > .material-symbols-rounded').click();
		cy.get('@onChangeSpy').should('have.been.calledWith', 1);
	});
});

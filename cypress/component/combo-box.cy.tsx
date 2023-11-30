import React from 'react';
import ComboBox from '@/components/combo-box.tsx';

describe('<ComboBox />', () => {
	it('Es funcional y Se puede escribir', () => {
		// See: https://on.cypress.io/mounting-react
		cy.mount(<ComboBox/>);
		cy.get('input').type('Hola Mundo');
	});
});

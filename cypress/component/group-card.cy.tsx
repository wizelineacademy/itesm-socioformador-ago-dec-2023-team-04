import React from 'react';
import {GroupCard} from '@/components/group-card.tsx';

describe('<GroupCard />', () => {
	it('Monta la Tarjeta con atributos modificados', () => {
		// See: https://on.cypress.io/mounting-react
		cy.mount(<GroupCard id={1} color='fbbf24' name='grupo' studentCount={4}/>);
	});
});

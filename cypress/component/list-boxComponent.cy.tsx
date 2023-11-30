import React from 'react';
import ListBox from '@/components/list-box.tsx';

describe('<ListBox />', () => {
	it('renders', () => {
		// See: https://on.cypress.io/mounting-react
		cy.mount(<ListBox/>);
	});
});

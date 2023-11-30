import React from 'react';
import {Item} from 'react-stately';
import Select from '@/components/select.tsx';

describe('<Select />', () => {
	it('Renderiza Correctamente', () => {
		// See: https://on.cypress.io/mounting-react
		cy.mount(<Select>
			<Item>
				Item 1
			</Item>
			<Item>
				Item 2
			</Item>
			<Item>
				Item 3
			</Item>

		</Select>);
	});
});

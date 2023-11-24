import {Button} from '@/components/button';
import 'cypress-real-events/support';

describe('button.cy.tsx', () => {
	it('playground', () => {
		cy.mount(<Button variant='primary' size='xl'>Hola</Button>);

		const boton = cy.get('Button');

		boton.realHover().should('have.css', 'background-color', 'rgb(212, 84, 89)');
	});
});

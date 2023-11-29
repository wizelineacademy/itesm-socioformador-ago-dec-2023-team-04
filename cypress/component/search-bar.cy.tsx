import SearchBar from '@/components/search-bar';

describe('search-bar.cy.tsx', () => {
	it('El espacio de Texto funciona correctamente', () => {
		cy.mount(<SearchBar/>);

		cy.get('input').should('have.attr', 'placeholder', 'Buscar');
	});
});

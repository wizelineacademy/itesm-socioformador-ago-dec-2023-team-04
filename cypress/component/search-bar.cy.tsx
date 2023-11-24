import SearchBar from '@/components/search-bar';

describe('search-bar.cy.tsx', () => {
	it('playground', () => {
		cy.mount(<SearchBar/>);

		cy.get('input').should('have.attr', 'placeholder', 'Buscar');
	});
});
